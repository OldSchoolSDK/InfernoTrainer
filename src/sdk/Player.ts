"use strict";
import _ from "lodash";

import { Pathing } from "./Pathing";
import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import { minBy, range, filter, find, map, min, uniq, sumBy, flatMap } from "lodash";
import { Unit, UnitTypes, UnitBonuses, UnitOptions } from "./Unit";
import { XpDropController } from "./XpDropController";
import { AttackBonuses, Weapon } from "./gear/Weapon";
import { BasePrayer } from "./BasePrayer";
import { XpDrop, XpDropAggregator } from "./XpDrop";
import { Location } from "./Location";
import { Mob } from "./Mob";
import { Equipment } from "./Equipment";
import { SetEffect } from "./SetEffect";
import chebyshev from "chebyshev";
import { ItemName } from "./ItemName";
import { Item } from "./Item";
import { Collision } from "./Collision";
import { Eating } from "./Eating";
import { PlayerStats } from "./PlayerStats";
import { PlayerRegenTimer } from "./PlayerRegenTimers";
import { PrayerController } from "./PrayerController";
import { AmmoType } from "./gear/Ammo";
import { Region } from "./Region";
import { Viewport } from "./Viewport";
import { Sound, SoundCache } from "./utils/SoundCache";

import LeatherHit from "../assets/sounds/hit.ogg";
import HumanHit from "../assets/sounds/human_hit_513.ogg";
import { Model } from "./rendering/Model";
import { TileMarker } from "../content/TileMarker";

import { GLTFModel } from "./rendering/GLTFModel";
import { PlayerAnimationIndices } from "./rendering/GLTFAnimationConstants";

/* eslint-disable @typescript-eslint/no-explicit-any */

class PlayerEffects {
  poisoned = 0;
  venomed = 0;
  stamina = 0;
}

// player can rotate this many JAUs per client tick
const PLAYER_ROTATION_RATE_JAU = 64;
const CLIENT_TICKS_PER_SECOND = 50;
const JAU_PER_RADIAN = 512;
const RADIANS_PER_TICK = ((CLIENT_TICKS_PER_SECOND * PLAYER_ROTATION_RATE_JAU) / JAU_PER_RADIAN) * 0.6;
const LOCAL_POINTS_PER_CELL = 128;

const ENABLE_POSITION_DEBUG = false;

// position that is "close enough"
const EPSILON = 0.1;

export class Player extends Unit {
  manualSpellCastSelection: Weapon;

  // this is the actual location that we want to move to (ignoring pathing)
  destinationLocation?: Location;
  // this is the location we are actually pathing towards
  pathTargetLocation?: Location;

  stats: PlayerStats;
  currentStats: PlayerStats;
  xpDrops: XpDropAggregator;
  overhead: BasePrayer;
  running = true;
  cachedBonuses: UnitBonuses = null;
  useSpecialAttack = false;
  effects = new PlayerEffects();
  regenTimer: PlayerRegenTimer = new PlayerRegenTimer(this);

  autocastDelay = 1;
  manualCastHasTarget = false;

  eats: Eating = new Eating();
  inventory: Item[];

  seekingItem: Item = null;

  path: (Location & { run: boolean })[] = [];

  clickMarker: ClickMarker | null = null;
  aggroMarker: ClickMarker | null = null;
  trueTileMarker: ClickMarker;

  pathMarkers: ClickMarker[] = [];
  currentPoseAnimation = PlayerAnimationIndices.Idle;

  constructor(region: Region, location: Location, options: UnitOptions = {}) {
    super(region, location, options);

    this.destinationLocation = location;
    this.pathTargetLocation = location;
    this.equipmentChanged();
    this.clearXpDrops();
    this.autoRetaliate = false;
    this.eats.player = this;

    this.setUnitOptions(options);

    this.prayerController = new PrayerController(this);
    this.trueTileMarker = new ClickMarker(this.region, this.location, "#00FFFF");
    this.region.addEntity(this.trueTileMarker);
  }

  contextActions(region: Region, x: number, y: number) {
    return super.contextActions(region, x, y).concat([
      {
        text: [
          { text: "Attack ", fillStyle: "white" },
          { text: `Player`, fillStyle: "yellow" },
          {
            text: ` (level ${this.combatLevel})`,
            fillStyle: Viewport.viewport.player.combatLevelColor(this),
          },
        ],
        action: () => {
          Viewport.viewport.clickController.redClick();
          Viewport.viewport.player.setAggro(this);
        },
      },
    ]);
  }

  setUnitOptions(options: UnitOptions) {
    this.equipment = options.equipment || {};
    this.inventory = options.inventory || new Array(28).fill(null);
    this.equipmentChanged();
  }

  interruptCombat() {
    this.setAggro(null);
  }

  get color() {
    return "#00FF00";
  }

  get isPlayer(): boolean {
    return true;
  }

  get attackRange() {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackRange;
    }
    if (this.equipment.weapon) {
      return this.equipment.weapon.attackRange;
    }
    return 1;
  }

  get attackSpeed() {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackSpeed;
    }
    if (this.equipment.weapon) {
      return this.equipment.weapon.attackSpeed;
    }
    return 5;
  }

  openInventorySlots(): number[] {
    const openSpots = [];
    for (let i = 0; i < 28; i++) {
      if (!this.inventory[i]) {
        openSpots.push(i);
      }
    }
    return openSpots;
  }

  postAttacksEvent() {
    this.eats.checkRedemption(this);
  }

  equipmentChanged() {
    this.interruptCombat();

    const gear = [
      this.equipment.weapon,
      this.equipment.offhand,
      this.equipment.helmet,
      this.equipment.necklace,
      this.equipment.chest,
      this.equipment.legs,
      this.equipment.feet,
      this.equipment.gloves,
      this.equipment.ring,
      this.equipment.cape,
    ];

    if (
      this.equipment.weapon &&
      this.equipment.ammo &&
      this.equipment.weapon.compatibleAmmo().includes(this.equipment.ammo.itemName)
    ) {
      gear.push(this.equipment.ammo);
    } else if (this.equipment.ammo && this.equipment.ammo.ammoType() == AmmoType.BLESSING) {
      gear.push(this.equipment.ammo);
    }

    // updated gear bonuses
    this.cachedBonuses = Unit.emptyBonuses();
    gear.forEach((g: Equipment) => {
      if (g && g.bonuses) {
        g.updateBonuses(gear);
        this.cachedBonuses = Unit.mergeEquipmentBonuses(this.cachedBonuses, g.bonuses);
      }
    });

    // update set effects
    const allSetEffects = [];
    gear.forEach((equipment: Equipment) => {
      if (equipment && equipment.equipmentSetEffect) {
        allSetEffects.push(equipment.equipmentSetEffect);
      }
    });
    const completeSetEffects = [];
    uniq(allSetEffects).forEach((setEffect: typeof SetEffect) => {
      const itemsInSet = setEffect.itemsInSet();
      let setItemsEquipped = 0;
      find(itemsInSet, (itemName: string) => {
        gear.forEach((equipment: Equipment) => {
          if (!equipment) {
            return;
          }
          if (itemName === equipment.itemName) {
            setItemsEquipped++;
          }
        });
      });
      if (itemsInSet.length === setItemsEquipped) {
        completeSetEffects.push(setEffect);
      }
    });
    this.setEffects = completeSetEffects;

    this.invalidateModel();
  }

  get bonuses(): UnitBonuses {
    return this.cachedBonuses;
  }

  setStats() {
    // non boosted numbers
    this.stats = Settings.player_stats;

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(Settings.player_stats));
  }

  get weight(): number {
    let gear: Item[] = [
      this.equipment.weapon,
      this.equipment.offhand,
      this.equipment.helmet,
      this.equipment.necklace,
      this.equipment.chest,
      this.equipment.legs,
      this.equipment.feet,
      this.equipment.gloves,
      this.equipment.ring,
      this.equipment.cape,
      this.equipment.ammo,
    ];
    gear = gear.concat(this.inventory);
    gear = filter(gear);

    const kgs = Math.max(Math.min(64, sumBy(gear, "weight")), 0);
    return kgs;
  }

  get prayerDrainResistance(): number {
    // https://oldschool.runescape.wiki/w/Prayer#Prayer_drain_mechanics
    return 2 * this.bonuses.other.prayer + 60;
  }

  get type() {
    return UnitTypes.PLAYER;
  }

  clearXpDrops() {
    this.xpDrops = {};
  }

  grantXp(xpDrop: XpDrop) {
    if (!this.xpDrops[xpDrop.skill]) {
      this.xpDrops[xpDrop.skill] = 0;
    }
    this.xpDrops[xpDrop.skill] += xpDrop.xp;
  }

  sendXpToController() {
    if (!XpDropController.controller) {
      return;
    }
    if (this !== Viewport.viewport.player) {
      return;
    }

    Object.keys(this.xpDrops).forEach((skill) => {
      XpDropController.controller.registerXpDrop({
        skill,
        xp: Math.ceil(this.xpDrops[skill]),
      });
    });

    this.clearXpDrops();
  }

  moveTo(x: number, y: number) {
    this.interruptCombat();

    this.manualSpellCastSelection = null;

    this.pathTargetLocation = null;

    const clickedOnEntities = Collision.collideableEntitiesAtPoint(this.region, x, y, 1);
    if (clickedOnEntities.length) {
      // Clicked on an entity, scan around to find the best spot to actually path to
      const clickedOnEntity = clickedOnEntities[0];
      const maxDist = Math.ceil(clickedOnEntity.size / 2);
      let bestDistances = [];
      let bestDistance = 9999;
      for (let yOff = -maxDist; yOff < maxDist; yOff++) {
        for (let xOff = -maxDist; xOff < maxDist; xOff++) {
          const potentialX = x + xOff;
          const potentialY = y + yOff;
          const e = Collision.collideableEntitiesAtPoint(this.region, potentialX, potentialY, 1);
          if (e.length === 0) {
            const distance = Pathing.dist(potentialX, potentialY, x, y);
            if (distance <= bestDistance) {
              if (bestDistances[0] && bestDistances[0].bestDistance > distance) {
                bestDistance = distance;
                bestDistances = [];
              }
              bestDistances.push({
                x: potentialX,
                y: potentialY,
                bestDistance,
              });
            }
          }
        }
      }
      const winner = minBy(bestDistances, (distance) =>
        Pathing.dist(distance.x, distance.y, this.location.x, this.location.y),
      );
      if (winner) {
        this.destinationLocation = { x: winner.x, y: winner.y };
      }
    } else {
      this.destinationLocation = { x, y };
    }
  }

  attack(): boolean {
    if (this.manualSpellCastSelection) {
      const target = this.aggro;
      this.manualSpellCastSelection.cast(this, target);
      this.manualSpellCastSelection = null;
      this.interruptCombat();
      this.destinationLocation = this.location;
    } else {
      // use equipped weapon
      if (this.equipment.weapon) {
        if (this.equipment.weapon.hasSpecialAttack() && this.useSpecialAttack) {
          if (this.currentStats.specialAttack >= this.equipment.weapon.specialAttackDrain()) {
            this.equipment.weapon.specialAttack(this, this.aggro as Unit /* hack */);
            this.currentStats.specialAttack -= this.equipment.weapon.specialAttackDrain();
            this.regenTimer.specUsed();
          }
          this.useSpecialAttack = false;
        } else {
          const bonuses: AttackBonuses = {};
          if (this.equipment.helmet && this.equipment.helmet.itemName === ItemName.SLAYER_HELMET_I) {
            bonuses.gearMeleeMultiplier = 7 / 6;
            bonuses.gearRangeMultiplier = 1.15;
            bonuses.gearMageMultiplier = 1.15;
          }

          return this.equipment.weapon.attack(this, this.aggro /* hack */, bonuses);
        }
      } else {
        return false;
      }
    }

    return true;
  }

  override playAttackSound() {
    if (this.equipment.weapon?.attackSound) {
      SoundCache.play(this.equipment.weapon?.attackSound);
    }
  }

  activatePrayers() {
    this.lastOverhead = this.overhead;
    this.overhead = this.prayerController.overhead();
    if (this.lastOverhead && !this.overhead) {
      this.lastOverhead.playOffSound();
    } else if (this.lastOverhead !== this.overhead) {
      this.overhead.playOnSound();
    }
  }

  setAggro(mob: Unit) {
    if (mob !== this.aggro) {
      // do spam clicks constantly reset autocast delay? idk
      this.autocastDelay = 1; // not sure if this is actually correct behavior but whatever
    }

    if (this.manualSpellCastSelection && mob != null) {
      this.manualCastHasTarget = true;
    } else {
      this.manualCastHasTarget = false;
    }

    this.aggro = mob;
    this.seekingItem = null;
  }

  setSeekingItem(item: Item) {
    this.interruptCombat();
    this.seekingItem = item;
  }
  determineDestination() {
    if (this.aggro) {
      if (this.aggro.dying > -1) {
        this.destinationLocation = this.location;
        return;
      }
      const isUnderAggrodMob = Collision.collisionMath(
        this.location.x,
        this.location.y,
        1,
        this.aggro.location.x,
        this.aggro.location.y,
        this.aggro.size,
      );
      this.setHasLOS();

      if (isUnderAggrodMob) {
        const maxDist = Math.ceil(this.aggro.size / 2);
        let bestDistance = 9999;
        let winner = null;
        for (let yy = -maxDist; yy < maxDist; yy++) {
          for (let xx = -maxDist; xx < maxDist; xx++) {
            const x = this.location.x + xx;
            const y = this.location.y + yy;
            if (Pathing.canTileBePathedTo(this.region, x, y, 1, {} as Mob)) {
              const distance = Pathing.dist(this.location.x, this.location.y, x, y);
              if (distance > 0 && distance < bestDistance) {
                bestDistance = distance;
                winner = { x, y };
              }
            }
          }
        }
        if (winner) {
          this.destinationLocation = { x: winner.x, y: winner.y };
        } else {
          console.log("I don't understand what could cause this, but i'd like to find out");
        }
      } else if (!this.hasLOS) {
        const seekingTiles: Location[] = [];
        // "When clicking on an npc, object, or player, the requested tiles will be all tiles"
        // "within melee range of the npc, object, or player."
        // For implementation reasons we also ensure the north/south tiles are added to seekingTiles *first* so that
        // in cases of ties, the north and south tiles are picked by minBy below.
        const aggroSize = this.aggro.size;
        range(0, aggroSize).forEach((xx) => {
          [-1, this.aggro.size].forEach((yy) => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Collision.collidesWithAnyEntities(this.region, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py,
              });
            }
          });
        });
        range(0, aggroSize).forEach((yy) => {
          [-1, this.aggro.size].forEach((xx) => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Collision.collidesWithAnyEntities(this.region, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py,
              });
            }
          });
        });
        // Create paths to all npc tiles
        const path = Pathing.constructPaths(this.region, this.location, seekingTiles);
        this.destinationLocation = path.destination ?? this.location;
      } else {
        // stop moving
        this.destinationLocation = this.location;
      }
    } else if (this.seekingItem) {
      this.destinationLocation = this.seekingItem.groundLocation;
    }
  }

  // WARNING: client ticks do NOT happen in line with render or logic ticks. Do not use this for anything other than
  // visual logic.
  clientTick(tickPercent) {
    // based on https://github.com/dennisdev/rs-map-viewer/blob/master/src/mapviewer/webgl/npc/Npc.ts#L115
    if (this.path.length === 0) {
      return;
    }
    let { x, y } = this.perceivedLocation;
    const { x: nextX, y: nextY, run } = this.path[0];

    const currentAngle = this.getPerceivedRotation(tickPercent);

    // 30 client ticks per tick and we want to walk 1 tile per tick so
    const baseMovementSpeed = 1 / 30;
    let movementSpeed = baseMovementSpeed;

    this.currentPoseAnimation = PlayerAnimationIndices.Walk;

    const canRotate = true;
    if (currentAngle !== this.nextAngle && canRotate) {
      if (ENABLE_POSITION_DEBUG) console.log("must rotate", this.path.length, run);
      movementSpeed = baseMovementSpeed / 2;
      this.currentPoseAnimation = PlayerAnimationIndices.Rotate180;
    }
    if (this.path.length === 3) {
      if (ENABLE_POSITION_DEBUG) console.log("path length medium", this.path.length, run);
      movementSpeed = baseMovementSpeed * 1.5;
    }
    if (this.path.length > 3) {
      if (ENABLE_POSITION_DEBUG) console.log("path length warp", this.path.length, run);
      movementSpeed = baseMovementSpeed * 2;
    }
    if (this.path.length < 3) {
      if (ENABLE_POSITION_DEBUG) console.log("normal speed", this.path.length, run);
    }
    if (run) {
      movementSpeed *= 2;
      this.currentPoseAnimation = PlayerAnimationIndices.Run;
    }
    let diffX = Math.abs(x - nextX);
    let diffY = Math.abs(y - nextY);
    if (diffX > EPSILON || diffY > EPSILON) {
      if (x < nextX) {
        x = Math.min(x + movementSpeed, nextX);
      } else if (x > nextX) {
        x = Math.max(x - movementSpeed, nextX);
      }
      if (y < nextY) {
        y = Math.min(y + movementSpeed, nextY);
      } else if (y > nextY) {
        y = Math.max(y - movementSpeed, nextY);
      }
    }
    this.perceivedLocation = { x, y };
    diffX = Math.abs(x - nextX);
    diffY = Math.abs(y - nextY);
    if (diffX < EPSILON && diffY < EPSILON) {
      this.perceivedLocation.x = nextX;
      this.perceivedLocation.y = nextY;
      this.path.shift();
      if (ENABLE_POSITION_DEBUG) {
        const headTile = this.pathMarkers.shift();
        this.region.removeEntity(headTile);
      }
      if (this.path.length === 0) {
        this.currentPoseAnimation = PlayerAnimationIndices.Idle;
        this.restingAngle = this.nextAngle;
      } else {
        this.nextAngle = this.getTargetAngle();
      }
    }
  }

  moveTowardsDestination() {
    this.trueTileMarker.location = this.location;
    this.nextAngle = this.getTargetAngle();
    // Calculate run energy
    const dist = this.pathTargetLocation
      ? chebyshev([this.location.x, this.location.y], [this.pathTargetLocation.x, this.pathTargetLocation.y])
      : 0;
    if (this.running && dist > 1) {
      const runReduction = 67 + Math.floor(67 + Math.min(Math.max(0, this.weight), 64) / 64);
      if (this.effects.stamina) {
        this.currentStats.run -= Math.floor(0.3 * runReduction);
      } else if (this.equipment.ring && this.equipment.ring.itemName === ItemName.RING_OF_ENDURANCE) {
        this.currentStats.run -= Math.floor(0.85 * runReduction);
      } else {
        this.currentStats.run -= runReduction;
      }
    } else {
      this.currentStats.run += Math.floor(this.currentStats.agility / 6) + 8;
    }
    this.currentStats.run = Math.min(Math.max(this.currentStats.run, 0), 10000);
    if (this.currentStats.run === 0) {
      this.running = false;
    }
    // Tick down stamina
    this.effects.stamina--;
    this.effects.stamina = Math.min(Math.max(this.effects.stamina, 0), 200);

    // Path to next position if not already there.
    if (
      !this.destinationLocation ||
      (this.location.x === this.destinationLocation.x && this.location.y === this.destinationLocation.y)
    ) {
      this.pathTargetLocation = null;
      return;
    }

    const speed = this.running ? 2 : 1;

    const { path, destination } = Pathing.path(this.region, this.location, this.destinationLocation, speed, this.aggro);
    this.pathTargetLocation = destination;
    if (!path.length || !destination) {
      return;
    }
    const originalLocation = this.location;
    if (path.length < speed) {
      // Step to the destination
      this.location = path[path.length - 1];
    } else {
      // Move one or two steps forward
      this.location = path[speed - 1];
    }
    // postprocess the path to corners only
    // save the next 2 steps for interpolation purposes
    let newTiles = path.map((pos, idx) => ({
      ...pos,
      run: this.running && path.length >= 2,
      direction: Pathing.angle(
        idx === 0 ? originalLocation.x : path[idx - 1].x,
        idx === 0 ? originalLocation.y : path[idx - 1].y,
        pos.x,
        pos.y,
      ),
    }));
    // only add corners to the path (and the last point)
    newTiles = newTiles.filter((v, idx) => idx === path.length - 1 || v.direction !== newTiles[idx + 1].direction);
    if (newTiles.length > 1 && newTiles[1].direction === newTiles[0].direction) {
      newTiles.shift();
    }
    if (ENABLE_POSITION_DEBUG) {
      newTiles.forEach((tile) => {
        const marker = new ClickMarker(this.region, tile, "#FF0000");
        this.pathMarkers.push(marker);
        this.region.addEntity(marker);
      });
    }
    this.path.push(...newTiles);
    //console.log(this.location, path, [...this.path]);

    this.trueTileMarker.location = this.location;
    this.nextAngle = this.getTargetAngle();
  }

  takeSeekingItem() {
    if (this.seekingItem) {
      if (this.seekingItem.groundLocation.x === this.location.x) {
        if (this.seekingItem.groundLocation.y === this.location.y) {
          // Verify player is close. Apparently we need to have the player keep track of this item
          this.region.removeGroundItem(this.seekingItem, this.location.x, this.location.y);
          const slots = this.openInventorySlots();
          if (slots.length) {
            const slot = slots[0];
            this.inventory[slot] = this.seekingItem;
          }
          this.seekingItem = null;
        }
      }
    }
  }

  dead() {
    super.dead();
    this.perceivedLocation = this.location;
    this.destinationLocation = this.location;
  }

  // Rotation Code
  private restingAngle = 0;
  private nextAngle = 0;

  private _angle = 0;

  private lastTickPercent = 0;

  getPerceivedRotation(tickPercent) {
    // https://gist.github.com/shaunlebron/8832585
    function shortAngleDist(a0, a1) {
      const da = (a1 - a0) % (Math.PI * 2);
      return ((2 * da) % (Math.PI * 2)) - da;
    }
    //
    const turnAmount = RADIANS_PER_TICK * Math.max(0, tickPercent - this.lastTickPercent);
    this.lastTickPercent = tickPercent;
    const diff = (this.nextAngle - this._angle + Math.PI * 2) % (Math.PI * 2);
    const direction = diff - Math.PI > 0 ? -1 : 1;
    if (diff >= turnAmount) {
      this._angle += turnAmount * direction;
    } else {
      this._angle = this.nextAngle;
    }
    return this._angle;
  }

  getTargetAngle() {
    if (this.aggro) {
      const angle = Pathing.angle(
        this.perceivedLocation.x + this.size / 2,
        this.perceivedLocation.y - this.size / 2,
        this.aggro.location.x + this.aggro.size / 2,
        this.aggro.location.y - this.aggro.size / 2,
      );
      return -angle;
    }
    if (this.path.length > 0) {
      const angle = Pathing.angle(this.perceivedLocation.x, this.perceivedLocation.y, this.path[0].x, this.path[0].y);
      return -angle;
    }
    return this.restingAngle;
  }

  movementStep() {
    if (this.dying > -1) {
      return;
    }

    this.activatePrayers();

    this.takeSeekingItem();

    if (!this.isFrozen()) {
      this.determineDestination();
      this.moveTowardsDestination();
    }

    this.updatePathMarker();
    this.frozen--;
  }

  removeClickMarker() {
    if (!this.clickMarker) {
      return;
    }
    this.clickMarker.remove();
    this.region.removeEntity(this.clickMarker);
    this.clickMarker = null;
  }

  updatePathMarker() {
    if (!this.pathTargetLocation) {
      this.removeClickMarker();
      return;
    }
    if (
      this.clickMarker &&
      this.location.x === this.pathTargetLocation.x &&
      this.location.y === this.pathTargetLocation.x
    ) {
      this.removeClickMarker();
    } else if (!this.clickMarker) {
      this.clickMarker = new ClickMarker(this.region, this.pathTargetLocation);
      this.region.addEntity(this.clickMarker);
    } else {
      this.clickMarker.location = this.pathTargetLocation;
    }
  }

  hitSound(damaged: boolean): Sound | null {
    return damaged ? new Sound(HumanHit, 0.1) : new Sound(LeatherHit, 0.15);
  }

  damageTaken() {
    if (
      this.prayerController.isPrayerActiveByName("Redemption") &&
      this.currentStats.hitpoint > 0 &&
      this.currentStats.hitpoint < Math.floor(this.stats.hitpoint / 10)
    ) {
      this.eats.redemptioned = true;
    }
  }

  pretick() {
    this.prayerController.tick(this);
  }

  override attackStep() {
    super.attackStep();
    this.detectDeath();

    this.processIncomingAttacks();

    if (this.dying > -1) {
      return;
    }

    this.clearXpDrops();

    this.attackIfPossible();

    this.eats.tickFood(this);

    this.regenTimer.regen();

    this.sendXpToController();
  }

  attackIfPossible() {
    if (this.canAttack() === false) {
      return;
    }

    if (this.aggro) {
      this.setHasLOS();
      if (this.hasLOS && this.attackDelay <= 0 && this.aggro.isDying() === false) {
        this.attack() && this.didAttack();
      } else if (
        this.manualSpellCastSelection &&
        this.manualCastHasTarget &&
        this.hasLOS &&
        this.attackDelay <= 0 &&
        this.aggro.dying == this.aggro.deathAnimationLength
      ) {
        // Phantom/ghost barrage
        this.attack() && this.didAttack();
      }

      // After allowing ghost barrage, unset aggro if enemy is dead
      if (this.aggro && this.aggro.isDying()) {
        this.interruptCombat();
      }
    }
  }

  draw(tickPercent: number) {
    // this.region.context.fillStyle = '#FFFF00'
    // this.region.context.fillRect(
    //   26 * Settings.tileSize,
    //   24 * Settings.tileSize,
    //   6 * Settings.tileSize,
    //   12 * Settings.tileSize
    // // 26 - 32 x
    // // 24 - 36 y

    // )
    if (Settings.displayPlayerLoS) {
      LineOfSight.drawLOS(
        this.region,
        this.location.x,
        this.location.y,
        this.size,
        this.attackRange,
        "#00FF0055",
        this.type === UnitTypes.MOB,
      );
    }

    this.region.context.save();
    const perceivedLocation = this.getPerceivedLocation(tickPercent);
    const perceivedX = perceivedLocation.x;
    const perceivedY = perceivedLocation.y;

    // Perceived location

    if (this.dying === -1) {
      this.region.context.globalAlpha = 0.7;
      this.region.context.fillStyle = "#FFFF00";
      this.region.context.fillRect(
        perceivedX * Settings.tileSize,
        perceivedY * Settings.tileSize,
        Settings.tileSize,
        Settings.tileSize,
      );
      this.region.context.globalAlpha = 1;
    }

    // Draw player on true tile
    this.region.context.fillStyle = "#ffffff73";
    // feedback for when you shoot
    if (this.shouldShowAttackAnimation()) {
      this.region.context.fillStyle = "#00FFFF";
    }
    if (this.dying > -1) {
      this.region.context.fillStyle = "#000";
    }
    this.region.context.strokeStyle = "#FFFFFF73";
    this.region.context.lineWidth = 3;
    this.region.context.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize,
    );

    // Destination location
    this.region.context.strokeStyle = "#FFFFFF73";
    this.region.context.lineWidth = 3;
    this.region.context.strokeRect(
      this.destinationLocation.x * Settings.tileSize,
      this.destinationLocation.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize,
    );
    this.region.context.restore();
    return { x: perceivedX, y: perceivedY };
  }

  getPerceivedLocation(tickPercent: number) {
    return { ...this.perceivedLocation, z: 0 };
  }

  drawUILayer(
    tickPercent: number,
    offset: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number,
    hitsplatsAbove: boolean,
  ) {
    if (this.dying > -1) {
      return;
    }
    context.save();

    context.translate(offset.x, offset.y);

    if (Settings.rotated === "south") {
      this.region.context.rotate(Math.PI);
    }
    this.drawHPBar(context, scale);
    this.drawHitsplats(context, scale, hitsplatsAbove);
    this.drawOverheadPrayers(context, scale);
    context.restore();
  }

  create3dModel(): Model {
    return GLTFModel.forRenderableMulti(
      this,
      Object.values(this.equipment)
        .map((e) => e?.model)
        .filter((e) => !!e),
      1 / 128,
    );
  }

  override get animationIndex() {
    return this.currentPoseAnimation;
  }

  override get drawOutline() {
    // not needed with a real 3d model
    return false;
  }

  override get attackAnimationId() {
    return this.equipment.weapon?.attackAnimationId;
  }

  get canBlendAttackAnimation() {
    return true;
  }
}

class ClickMarker extends TileMarker {
  constructor(region: Region, location: Location, color = "#FFFFFF") {
    super(region, location, color, 1, false);
  }
  remove() {
    this.dying = 0;
  }
}
