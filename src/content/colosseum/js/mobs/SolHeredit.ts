"use strict";

import _ from "lodash";

import {
  Assets,
  DelayedAction,
  EquipmentControls,
  GLTFModel,
  Collision,
  Region,
  Location,
  EquipmentTypes,
  AttackIndicators,
  Mob,
  Pathing,
  Random,
  UnitBonuses,
  MeleeWeapon,
  Projectile,
  Sound,
  SoundCache,
  Trainer,
} from "@supalosa/oldschool-trainer-sdk";

import { SolGroundSlam } from "../entities/SolGroundSlam";
import { RingBuffer } from "../utils/RingBuffer";
import { ColosseumSettings } from "../ColosseumSettings";

import SpearStart from "../../assets/sounds/8147_spear.ogg";
import SpearEnd from "../../assets/sounds/8047_spear_swing.ogg";
import ShieldStart from "../../assets/sounds/8150_shield_start.ogg";
import ShieldEnd from "../../assets/sounds/8145_shield_stomp.ogg";
import TripleStart from "../../assets/sounds/8211_triple_charge.ogg";
import TripleCharge1 from "../../assets/sounds/8317_triple_charge_1.ogg";
import TripleCharge2 from "../../assets/sounds/8274_triple_charge_2.ogg";
import TripleCharge3Short from "../../assets/sounds/8218_triple_charge_3_short.ogg";
import TripleCharge3Long from "../../assets/sounds/8113_triple_charge_3_long.ogg";
import TripleParry1 from "../../assets/sounds/8140_triple_parry_1.ogg";
import TripleParry2 from "../../assets/sounds/8171_triple_parry_2.ogg";
import TripleParry3 from "../../assets/sounds/8242_triple_parry_3.ogg";
import GrappleCharge from "../../assets/sounds/8329_grapple_charge.ogg";
import GrappleParry from "../../assets/sounds/8081_grapple_parry.ogg";
import PoolSpawn from "../../assets/sounds/8053_pool_spawn.ogg";
import PoolShriek from "../../assets/sounds/8093_pool_shriek.ogg";
import LaserCharge from "../../assets/sounds/8253_laser.ogg";
import LaserFire from "../../assets/sounds/8230_laser_fire.ogg";

import { SolSandPool } from "../entities/SolSandPool";
import { Edge, LaserOrb } from "../entities/LaserOrb";
import { ColosseumConstants } from "../Constants";

export const SolHereditModel = Assets.getAssetUrl("models/sol2.glb");

enum SolAnimations {
  Idle = 0, // 10874
  Walk = 1, // 10878
  SpearSlow = 2, // 10883
  Grapple = 3, // 10884
  Shield = 4, // 10885
  TripleAttackLong = 5, // 10886
  TripleAttackShort = 6, // 10887
  Death = 7, // 10888
}

enum AttackDirection {
  West,
  East,
  North,
  South,
  NorthEast,
  NorthWest,
  SouthEast,
  SouthWest,
}

const DIRECTIONS = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: -1 },
  { dx: 1, dy: 1 },
  { dx: -1, dy: 1 },
];

const SPEAR_START = new Sound(SpearStart, 0.1);
const SPEAR_END = new Sound(SpearEnd, 0.1);
const SHIELD_START = new Sound(ShieldStart, 0.1);
const SHIELD_END = new Sound(ShieldEnd, 0.1);
const TRIPLE_START = new Sound(TripleStart, 0.1);
const TRIPLE_CHARGE_1 = new Sound(TripleCharge1, 0.1);
const TRIPLE_CHARGE_2 = new Sound(TripleCharge2, 0.1);
const TRIPLE_CHARGE_3_SHORT = new Sound(TripleCharge3Short, 0.1);
const TRIPLE_CHARGE_3_LONG = new Sound(TripleCharge3Long, 0.1);

const TRIPLE_PARRY_1 = new Sound(TripleParry1, 0.1);
const TRIPLE_PARRY_2 = new Sound(TripleParry2, 0.1);
const TRIPLE_PARRY_3 = new Sound(TripleParry3, 0.1);

const GRAPPLE_CHARGE = new Sound(GrappleCharge, 0.1);
const GRAPPLE_PARRY = new Sound(GrappleParry, 0.1);

const POOL_SPAWN = new Sound(PoolSpawn, 0.1);
const POOL_SHRIEK = new Sound(PoolShriek, 0.1);
const LASER_CHARGE = new Sound(LaserCharge, 0.1);
const LASER_FIRE = new Sound(LaserFire, 0.1);

const SPECIAL_ATTACK_COOLDOWN = 2;

export enum Attacks {
  SPEAR = "spear",
  SHIELD = "shield",
  TRIPLE_LONG = "triple_long",
  TRIPLE_SHORT = "triple_short",
  GRAPPLE = "grapple",
  PHASE_TRANSITION = "phase_transition",
}

export const PHASE_TRANSITION_POINTS: [number, string][] = [
  [1500, "Let's start by testing your footwork."],
  [1350, "Not bad. Let's try something else..."],
  [1125, "Impressive. Let's see how you handle this..."],
  [750, "You can't win!"],
  [375, "Ralos guides my hand!"],
  [150, "LET'S END THIS!"],
];

const GRAPPLE_SLOTS: { [slot in EquipmentTypes]?: string } = {
  [EquipmentTypes.CHEST]: "<col=ff0000>I'LL CRUSH YOUR </color><col=ffffff>BODY</color><col=ff0000>!</color>",
  [EquipmentTypes.BACK]: "<col=ff0000>I'LL BREAK YOUR </color><col=ffffff>BACK</color><col=ff0000>!</color>",
  [EquipmentTypes.GLOVES]: "<col=ff0000>I'LL TWIST YOUR </color><col=ffffff>HANDS</color><col=ff0000> OFF!</color>",
  [EquipmentTypes.LEGS]: "<col=ff0000>I'LL BREAK YOUR </color><col=ffffff>LEGS</color><col=ff0000>!</color>",
  [EquipmentTypes.FEET]: "<col=ff0000>I'LL CUT YOUR </color><col=ffffff>FEET</color><col=ff0000> OFF!</color>",
};

// used when the player messed up the parry
class ParryUnblockableWeapon extends MeleeWeapon {
  override isBlockable() {
    return false;
  }
}

const MIN_LASER_ORB_COOLDOWN = 25;
const MAX_LASER_ORB_COOLDOWN = 35;
const ENRAGE_LASER_ORB_COOLDOWN = 12;

export class SolHeredit extends Mob {
  shouldRespawnMobs: boolean;
  // public for testing
  firstSpear = true;
  firstShield = true;

  specialAttackCooldown = 0;

  forceAttack: Attacks | null = Attacks.SPEAR; // first attack is always a spear?

  lastLocation = { ...this.location };

  laserOrbs: LaserOrb[];
  laserOrbCooldown = MIN_LASER_ORB_COOLDOWN;

  phaseId = -1;
  poolCache: { [xy: string]: boolean } = {};
  finalPhasePoolTimer = 7; // once the phase transition is up

  // melee prayer overhead history of target
  overheadHistory: RingBuffer = new RingBuffer(5);

  stationaryTimer = 0;

  // for instancing of slams
  tickNumber = 0;

  mobName() {
    return "Sol Heredit";
  }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  get combatLevel() {
    return 1200;
  }

  get healthScale() {
    return this.stats.hitpoint;
  }

  visible() {
    return true;
  }

  dead() {
    super.dead();
  }

  setStats() {
    this.laserOrbs = [];
    this.stunned = 4;
    this.weapons = {
      stab: new MeleeWeapon(),
    };

    this.stats = {
      attack: 350,
      strength: 400,
      defence: 200,
      range: 350,
      magic: 300,
      hitpoint: ColosseumSettings.echoMaxHp ? 1725 : 1500,
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 250,
        slash: 0,
        crush: 0,
        magic: 80,
        range: 150,
      },
      defence: {
        stab: 65,
        slash: 5,
        crush: 30,
        magic: 750,
        range: 825,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 5,
        magicDamage: 1.0,
        prayer: 0,
      },
    };
  }

  override contextActions(region: Region, x: number, y: number) {
    return super.contextActions(region, x, y).concat(
      PHASE_TRANSITION_POINTS.map(([hp], idx) => ({
        text: [
          { text: "Set to ", fillStyle: "white" },
          { text: `${hp}`, fillStyle: "yellow" },
          { text: " hp ", fillStyle: "white" },
        ],
        action: () => {
          Trainer.clickController.redClick();
          this.phaseId = idx;
          this.currentStats.hitpoint = hp;
        },
      })),
    );
  }

  get attackSpeed() {
    // irrelevant
    return 7;
  }

  get attackRange() {
    return 1;
  }

  get size() {
    return 5;
  }

  attackStyleForNewAttack() {
    return "stab" as const;
  }

  canMeleeIfClose() {
    return "stab" as const;
  }

  magicMaxHit() {
    return 70;
  }

  get maxHit() {
    return 70;
  }

  attackAnimation(tickPercent: number, context) {
    context.rotate(tickPercent * Math.PI * 2);
  }

  attackIfPossible() {
    this.tickNumber++;
    this.laserOrbCooldown--;
    const overhead = this.aggro?.prayerController.overhead();
    this.overheadHistory.push(overhead && (["Protect from Melee", "Protect from Range", "Protect from Magic"].includes(overhead.name)));
    this.attackStyle = this.attackStyleForNewAttack();

    this.attackFeedback = AttackIndicators.NONE;

    if (
      ColosseumSettings.usePhaseTransitions &&
      this.attackDelay <= 0 &&
      this.phaseId < PHASE_TRANSITION_POINTS.length - 1
    ) {
      const [threshold, message] = PHASE_TRANSITION_POINTS[this.phaseId + 1];
      if (this.currentStats.hitpoint <= threshold) {
        if (this.phaseId >= 0) {
          // none on the first phase transition
          this.forceAttack = Attacks.PHASE_TRANSITION;
        }
        this.phaseId++;
        this.setOverheadText(message);
      }
    }
    if ((this.phaseId === 5 || ColosseumSettings.echoEnrage) && this.aggro) {
      if (--this.finalPhasePoolTimer === 0) {
        this.tryPlacePools(this.aggro.location.x, this.aggro.location.y, 1);
        this.finalPhasePoolTimer = 3;
      }
    }

    if (!this.aggro) {
      return;
    }

    this.hadLOS = this.hasLOS;
    // override LOS check to attack melee diagonally
    const [tx, ty] = this.getClosestTileTo(this.aggro.location.x, this.aggro.location.y);
    const dx = this.aggro.location.x - tx,
      dy = this.aggro.location.y - ty;
    const isAdjacent = Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    this.hasLOS = isAdjacent;

    if (this.canAttack() === false) {
      return;
    }

    // can phase without being in range
    const inRange = this.hasLOS || this.forceAttack === Attacks.PHASE_TRANSITION;
    if (inRange && this.attackDelay <= 0 && this.stationaryTimer > 0) {
      const nextAttack = this.selectAttack();
      this.forceAttack = null;
      let nextDelay = 0;
      switch (nextAttack) {
        case Attacks.SHIELD:
          nextDelay = this.attackShield();
          this.specialAttackCooldown--;
          break;
        case Attacks.SPEAR:
          nextDelay = this.attackSpear();
          this.specialAttackCooldown--;
          break;
        case Attacks.TRIPLE_SHORT:
          this.specialAttackCooldown = SPECIAL_ATTACK_COOLDOWN;
          nextDelay = this.attackTripleShort();
          break;
        case Attacks.TRIPLE_LONG:
          this.specialAttackCooldown = SPECIAL_ATTACK_COOLDOWN;
          nextDelay = this.attackTripleLong();
          break;
        case Attacks.GRAPPLE:
          this.specialAttackCooldown = SPECIAL_ATTACK_COOLDOWN;
          nextDelay = this.attackGrapple();
          break;
        case Attacks.PHASE_TRANSITION:
          this.forceAttack = Attacks.SPEAR;
          nextDelay = this.phaseTransition(this.phaseId);
          break;
      }
      this.didAttack();
      this.attackDelay = nextDelay;
      // trigger laser orbs on anything but a phase transition
      if (nextAttack !== Attacks.PHASE_TRANSITION && this.laserOrbs.length > 0 && this.laserOrbCooldown < 0) {
        this.fireOrbs();
      }
    }
  }

  private selectAttack() {
    if (this.forceAttack) {
      return this.forceAttack;
    }
    const canSpecial = this.specialAttackCooldown <= 0;

    const attackPool = [
      // hacky 2x weighting for autos
      ...(ColosseumSettings.useShields && [Attacks.SHIELD]),
      ...(ColosseumSettings.useShields && [Attacks.SHIELD]),
      ...(ColosseumSettings.useSpears && [Attacks.SPEAR]),
      ...(ColosseumSettings.useSpears && [Attacks.SPEAR]),
      ...(ColosseumSettings.useTriple && canSpecial && this.phaseId >= 3 && [Attacks.TRIPLE_LONG]),
      ...(ColosseumSettings.useTriple && canSpecial && this.phaseId >= 1 && this.phaseId < 3 && [Attacks.TRIPLE_SHORT]),
      ...(ColosseumSettings.useGrapple && canSpecial && this.phaseId >= 2 && [Attacks.GRAPPLE]),
    ];
    if (attackPool.length === 0) {
      // at least allow it to do something
      this.specialAttackCooldown = 0;
      return null;
    }
    return attackPool[Math.floor(Random.get() * attackPool.length)];
  }

  private attackSpear() {
    this.freeze(6);
    this.playAnimation(SolAnimations.SpearSlow);
    SoundCache.play(SPEAR_START);
    DelayedAction.registerDelayedAction(
      new DelayedAction(this.firstSpear ? this.doFirstSpear.bind(this) : this.doSecondSpear.bind(this), 2),
    );
    DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(SPEAR_END), 3));
    this.firstSpear = !this.firstSpear;
    this.firstShield = true;
    return this.phaseId < 2 ? 7 : 6;
  }

  private attackShield() {
    this.freeze(4);
    this.playAnimation(SolAnimations.Shield);
    SoundCache.play(SHIELD_START);
    DelayedAction.registerDelayedAction(
      new DelayedAction(this.firstShield ? this.doFirstShield.bind(this) : this.doSecondShield.bind(this), 2),
    );
    DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(SHIELD_END), 3));
    this.firstSpear = true;
    this.firstShield = !this.firstShield;
    return this.phaseId < 2 ? 6 : 5;
  }

  private fillRect(fromX: number, fromY: number, toX: number, toY: number, exceptRadius = null) {
    if (!this.aggro) {
      return;
    }
    const midX = Math.floor((toX - fromX) / 2);
    const midY = Math.floor((toY - fromY) / 2);
    const radius = (Math.abs(fromX - toX) - 1) / 2 + 1;
    for (let xx = fromX; xx < toX; ++xx) {
      for (let yy = toY; yy > fromY; --yy) {
        const radX = Math.abs(fromX + midX - xx);
        const radY = Math.abs(fromY + midY - yy + 1);
        if ((radX === exceptRadius && radY <= exceptRadius) || (radY === exceptRadius && radX <= exceptRadius)) {
          continue;
        }
        const delay = Math.max(radX, radY) / radius;
        this.region.addEntity(
          new SolGroundSlam(this.region, { x: xx, y: yy }, this, this.aggro, delay, this.tickNumber),
        );
      }
    }
  }

  // Bresenham's line algorirthm
  private fillLine(fromX: number, fromY: number, direction: AttackDirection, length: number) {
    if (!this.aggro) {
      return;
    }
    const toX = fromX + DIRECTIONS[direction].dx * length;
    const toY = fromY + DIRECTIONS[direction].dy * length;
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    const sx = Math.sign(toX - fromX);
    const sy = Math.sign(toY - fromY);
    let err = dx - dy;
    let n = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const delay = n / length;
      this.region.addEntity(
        new SolGroundSlam(this.region, { x: fromX, y: fromY }, this, this.aggro, delay, this.tickNumber),
      );
      n++;
      if (fromX === toX && fromY === toY) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        fromX += sx;
      }
      if (e2 < dx) {
        err += dx;
        fromY += sy;
      }
    }
  }

  private doFirstSpear() {
    const LINE_LENGTH = 7;
    // slam under boss
    this.fillRect(this.location.x, this.location.y - this.size, this.location.x + this.size, this.location.y);
    const direction = this.getAttackDirection();
    // slam line facing player
    switch (direction) {
      case AttackDirection.West:
        this.fillRect(this.location.x - 1, this.location.y - this.size, this.location.x, this.location.y);
        this.fillLine(this.location.x - 2, this.location.y - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x - 2, this.location.y - 3, direction, LINE_LENGTH);
        break;
      case AttackDirection.East:
        this.fillRect(
          this.location.x + this.size,
          this.location.y - this.size,
          this.location.x + this.size + 1,
          this.location.y,
        );
        this.fillLine(this.location.x + this.size + 1, this.location.y - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size + 1, this.location.y - 3, direction, LINE_LENGTH);
        break;
      case AttackDirection.North:
        this.fillRect(
          this.location.x,
          this.location.y - this.size - 1,
          this.location.x + this.size,
          this.location.y - this.size,
        );
        this.fillLine(this.location.x + 1, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 3, this.location.y - this.size - 1, direction, LINE_LENGTH);
        break;
      case AttackDirection.South:
        this.fillRect(this.location.x, this.location.y, this.location.x + this.size, this.location.y + 1);
        this.fillLine(this.location.x + 1, this.location.y + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 3, this.location.y + 2, direction, LINE_LENGTH);
        break;
      case AttackDirection.NorthEast:
        this.fillLine(this.location.x + this.size - 1, this.location.y - this.size, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size, this.location.y - this.size + 1, direction, LINE_LENGTH);
        break;
      case AttackDirection.SouthEast:
        this.fillLine(this.location.x + this.size, this.location.y, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size - 1, this.location.y + 1, direction, LINE_LENGTH);
        break;
      case AttackDirection.SouthWest:
        this.fillLine(this.location.x - 1, this.location.y, direction, LINE_LENGTH);
        this.fillLine(this.location.x, this.location.y + 1, direction, LINE_LENGTH);
        break;
      case AttackDirection.NorthWest:
        this.fillLine(this.location.x - 1, this.location.y - this.size + 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x, this.location.y - this.size, direction, LINE_LENGTH);
        break;
    }
  }

  private doSecondSpear() {
    const LINE_LENGTH = 7;
    // slam under boss
    this.fillRect(
      this.location.x - 1,
      this.location.y - this.size - 1,
      this.location.x + this.size + 1,
      this.location.y + 1,
    );
    const direction = this.getAttackDirection();
    // slam line facing player
    switch (direction) {
      case AttackDirection.West:
        this.fillRect(this.location.x - 1, this.location.y - this.size, this.location.x, this.location.y);
        this.fillLine(this.location.x - 2, this.location.y, direction, LINE_LENGTH);
        this.fillLine(this.location.x - 2, this.location.y - 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x - 2, this.location.y - 4, direction, LINE_LENGTH);
        break;
      case AttackDirection.East:
        this.fillLine(this.location.x + this.size + 1, this.location.y, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size + 1, this.location.y - 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size + 1, this.location.y - 4, direction, LINE_LENGTH);
        break;
      case AttackDirection.North:
        this.fillLine(this.location.x, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 2, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 4, this.location.y - this.size - 1, direction, LINE_LENGTH);
        break;
      case AttackDirection.South:
        this.fillLine(this.location.x, this.location.y + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 2, this.location.y + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 4, this.location.y + 2, direction, LINE_LENGTH);
        break;
      case AttackDirection.NorthEast:
        this.fillLine(this.location.x + this.size + 1, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size - 2, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size + 1, this.location.y - this.size + 2, direction, LINE_LENGTH);
        break;
      case AttackDirection.SouthEast:
        this.fillLine(this.location.x + this.size + 1, this.location.y - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size + 1, this.location.y + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x + this.size - 2, this.location.y + 2, direction, LINE_LENGTH);
        break;
      case AttackDirection.SouthWest:
        this.fillLine(this.location.x - 2, this.location.y + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x - 2, this.location.y - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 1, this.location.y + 2, direction, LINE_LENGTH);
        break;
      case AttackDirection.NorthWest:
        this.fillLine(this.location.x - 2, this.location.y - this.size + 2, direction, LINE_LENGTH);
        this.fillLine(this.location.x - 2, this.location.y - this.size - 1, direction, LINE_LENGTH);
        this.fillLine(this.location.x + 1, this.location.y - this.size - 1, direction, LINE_LENGTH);
        break;
    }
  }

  private doFirstShield() {
    this.fillRect(this.location.x - 7, this.location.y - 12, this.location.x + 12, this.location.y + 7, 4);
  }

  private doSecondShield() {
    this.fillRect(this.location.x - 7, this.location.y - 12, this.location.x + 12, this.location.y + 7, 5);
  }

  private attackTripleShort() {
    this.firstShield = true;
    this.firstSpear = true;
    // used above 50%
    this.playAnimation(SolAnimations.TripleAttackShort);
    this._attackTriple(true);
    return this.phaseId >= 2 ? 11 : 12; // should be 11 between 50% and 75%
  }

  private attackTripleLong() {
    this.firstShield = true;
    this.firstSpear = true;
    // used below 50%
    this.playAnimation(SolAnimations.TripleAttackLong);
    this._attackTriple(false);
    return 12;
  }

  private attackGrapple() {
    this.freeze(5);
    this.firstShield = true;
    this.firstSpear = true;
    const slotIdx = Math.floor(Random.get() * Object.keys(GRAPPLE_SLOTS).length);
    const slot = Object.keys(GRAPPLE_SLOTS)[slotIdx];
    const overheadText = GRAPPLE_SLOTS[slot];
    this.setOverheadText(overheadText);

    let didParry = false;

    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        this.playAnimation(SolAnimations.Grapple);
        SoundCache.play(GRAPPLE_CHARGE);
      }, 1),
    );
    EquipmentControls?.instance.addEquipmentInteraction((clickedSlot) => {
      if (clickedSlot === slot) {
        didParry = true;
      }
    });
    DelayedAction.registerDelayedNpcAction(
      new DelayedAction(() => {
        if (didParry) {
          SoundCache.play(GRAPPLE_PARRY);
        }
        // queue damage to be played this tick (remember NPCs take turn before enemy)
        this.aggro.addProjectile(
          new Projectile(
            new ParryUnblockableWeapon(),
            didParry ? 0 : 20 + Math.floor(Random.get() * 25),
            this,
            this.aggro,
            "stab",
            { hidden: true, setDelay: 0 },
          ),
        );
        EquipmentControls?.instance.resetEquipmentInteractions();
      }, 4),
    );
    return 7; // only used under 75%, so always at 7
  }

  private _attackTriple(short: boolean) {
    SoundCache.play(TRIPLE_START);
    SoundCache.play(TRIPLE_CHARGE_1);
    DelayedAction.registerDelayedAction(new DelayedAction(this.doParryAttack(15, 3).bind(this), 2));
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        SoundCache.play(TRIPLE_PARRY_1);
      }, 3),
    );
    DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_CHARGE_2), 4));
    DelayedAction.registerDelayedAction(new DelayedAction(this.doParryAttack(short ? 25 : 30, 2).bind(this), 5));
    DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_PARRY_2), 6));
    if (short) {
      DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_CHARGE_3_SHORT), 6));
      DelayedAction.registerDelayedAction(new DelayedAction(this.doParryAttack(35, 2).bind(this), 8));
      DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_PARRY_3), 9));
    } else {
      DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_CHARGE_3_LONG), 6));
      DelayedAction.registerDelayedAction(new DelayedAction(this.doParryAttack(45, 3).bind(this), 9));
      DelayedAction.registerDelayedAction(new DelayedAction(() => SoundCache.play(TRIPLE_PARRY_3), 10));
    }
  }

  private wasOverheadOn(ticks: number) {
    for (let i = 0; i < ticks; ++i) {
      if (this.overheadHistory.pop()) {
        return true;
      }
    }
    return false;
  }

  private doParryAttack = (damage: number, ticks: number) => () => {
    const overheadWasOn = this.wasOverheadOn(ticks);
    this.aggro?.addProjectile(
      new Projectile(
        overheadWasOn ? new ParryUnblockableWeapon() : new MeleeWeapon(),
        damage,
        this,
        this.aggro,
        "stab",
        { hidden: true, setDelay: 1, checkPrayerAtHit: !overheadWasOn },
      ),
    );
    this.aggro?.prayerController.findPrayerByName("Protect from Melee").deactivate();
    this.aggro?.prayerController.findPrayerByName("Protect from Range").deactivate();
    this.aggro?.prayerController.findPrayerByName("Protect from Magic").deactivate();
    this.overheadHistory.clear();
  };

  private phaseTransition(toPhase: number) {
    this.freeze(5);
    const lastAggro = this.aggro;
    const { x, y } = this.aggro.location;
    DelayedAction.registerDelayedNpcAction(
      new DelayedAction(() => {
        this.tryPlacePool(x, y);
        const numOtherPools = toPhase === 5 ? 4 : 5;
        this.tryPlacePools(x, y, numOtherPools);
      }, 1),
    );
    this.aggro = null;
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        this.aggro = lastAggro;
      }, 5),
    );
    if (toPhase >= 1 && toPhase <= 4) {
      this.createLaserOrb();
    } else if (toPhase >= 5) {
      this.laserOrbCooldown = ENRAGE_LASER_ORB_COOLDOWN; // force laser
    }
    return 7;
  }

  private tryPlacePools(x: number, y: number, amount: number) {
    SoundCache.play(POOL_SPAWN);
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        SoundCache.play(POOL_SHRIEK);
      }, 2),
    );
    for (let i = 0; i < amount; ++i) {
      const xx = _.clamp(
        x - 4 + Math.floor(Random.get() * 9),
        ColosseumConstants.ARENA_WEST + 1,
        ColosseumConstants.ARENA_EAST - 1,
      );
      const yy = _.clamp(
        y - 4 + Math.floor(Random.get() * 9),
        ColosseumConstants.ARENA_NORTH + 1,
        ColosseumConstants.ARENA_SOUTH - 1,
      );
      this.tryPlacePool(xx, yy);
    }
  }

  private tryPlacePool(x: number, y: number) {
    const key = `${x}.${y}`;
    if (this.poolCache[key]) {
      return;
    }
    this.poolCache[key] = true;
    this.region.addEntity(new SolSandPool(this.region, { x, y }));
  }

  private getAttackDirection() {
    const [closestX, closestY] = this.getClosestTileTo(this.aggro.location.x, this.aggro.location.y);
    const dx = this.aggro.location.x - closestX;
    const dy = this.aggro.location.y - closestY;
    if (dx < 0 && dy === 0) {
      return AttackDirection.West;
    } else if (dx < 0 && dy < 0) {
      return AttackDirection.NorthWest;
    } else if (dx === 0 && dy < 0) {
      return AttackDirection.North;
    } else if (dx > 0 && dy < 0) {
      return AttackDirection.NorthEast;
    } else if (dx > 0 && dy === 0) {
      return AttackDirection.East;
    } else if (dx > 0 && dy > 0) {
      return AttackDirection.SouthEast;
    } else if (dx === 0 && dy > 0) {
      return AttackDirection.South;
    } else {
      // technically also if dx = 0 and dy = 0, i.e. you're under the boss
      return AttackDirection.SouthWest;
    }
  }

  private createLaserOrb() {
    if (this.laserOrbs.length >= 4) {
      return;
    }
    const orbEdge = [Edge.NORTH, Edge.EAST, Edge.SOUTH, Edge.WEST][this.laserOrbs.length];
    const orb = LaserOrb.onEdge(this.region, orbEdge);
    this.laserOrbs.push(orb);
    this.region.addEntity(orb);
  }

  private fireOrbs() {
    this.laserOrbs.forEach((orb) => orb.fire());
    if (this.phaseId < 5) {
      this.laserOrbCooldown =
        MIN_LASER_ORB_COOLDOWN + Math.floor(Random.get() * (MAX_LASER_ORB_COOLDOWN - MIN_LASER_ORB_COOLDOWN));
    } else {
      this.laserOrbCooldown = ENRAGE_LASER_ORB_COOLDOWN;
    }
    if (ColosseumSettings.echoLasers || ColosseumSettings.echoEnrage) {
      this.laserOrbCooldown = ENRAGE_LASER_ORB_COOLDOWN;
    }
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        SoundCache.play(LASER_CHARGE);
      }, 3),
    );
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        SoundCache.play(LASER_FIRE);
      }, 7),
    );
    // echo: pick two orbs to follow the player for 12 ticks
    if (ColosseumSettings.echoLasers) {
      const northSouthOrb = Random.get() < 0.5 ? Edge.NORTH : Edge.SOUTH;
      const eastWestOrb = Random.get() < 0.5 ? Edge.NORTH : Edge.SOUTH;
      this.laserOrbs
      .filter((orb) => orb.edge === northSouthOrb || orb.edge === eastWestOrb)
      .forEach((orb) => orb.echoFollowPlayer(ENRAGE_LASER_ORB_COOLDOWN))
    }
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, SolHereditModel, { scale: 0.02 });
  }

  override get idlePoseId() {
    return SolAnimations.Idle;
  }

  override get walkingPoseId() {
    return SolAnimations.Walk;
  }

  override get attackAnimationId() {
    // controlled separately
    return null;
  }

  override get deathAnimationId() {
    return SolAnimations.Death;
  }

  override get deathAnimationLength() {
    return 8;
  }

  get maxSpeed() {
    return 2;
  }

  override movementStep() {
    super.movementStep();
    if (this.lastLocation.x === this.location.x && this.lastLocation.y === this.location.y) {
      ++this.stationaryTimer;
    } else {
      this.stationaryTimer = 0;
    }
    this.lastLocation = { ...this.location };
  }

  override getNextMovementStep() {
    if (!this.aggro) {
      return { dx: this.location.x, dy: this.location.y };
    }
    const { x: tx, y: ty } = this.aggro.location;
    const closestTile = this.getClosestTileTo(tx, ty);
    const originLocation = { x: closestTile[0], y: closestTile[1] };
    const seekingTiles: Location[] = [];
    const aggroSize = this.aggro.size;
    _.range(0, aggroSize).forEach((xx) => {
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
    _.range(0, aggroSize).forEach((yy) => {
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
    const { destination, path } = Pathing.constructPaths(this.region, originLocation, seekingTiles);
    if (path.length === 0) {
      return;
    }
    let diffX = 0,
      diffY = 0;
    if (path.length <= this.maxSpeed) {
      // Step to the destination
      diffX = path[0].x - originLocation.x;
      diffY = path[0].y - originLocation.y;
    } else {
      // Move two steps forward
      diffX = path[path.length - this.maxSpeed - 1].x - originLocation.x;
      diffY = path[path.length - this.maxSpeed - 1].y - originLocation.y;
    }

    let dx = this.location.x + diffX;
    let dy = this.location.y + diffY;
    if (
      Collision.collisionMath(
        this.location.x,
        this.location.y,
        this.size,
        this.aggro.location.x,
        this.aggro.location.y,
        1,
      )
    ) {
      // Random movement if player is under the mob.
      if (Random.get() < 0.5) {
        dy = this.location.y;
        if (Random.get() < 0.5) {
          dx = this.location.x + 1;
        } else {
          dx = this.location.x - 1;
        }
      } else {
        dx = this.location.x;
        if (Random.get() < 0.5) {
          dy = this.location.y + 1;
        } else {
          dy = this.location.y - 1;
        }
      }
    }
    return { dx, dy };
  }

  override get drawTrueTile() {
    return true;
  }

  override drawUILayer(tickPercent, offset, context, scale, hitsplatsAbove) {
    super.drawUILayer(tickPercent, offset, context, scale, hitsplatsAbove);
    // draw overhead text on the bottom left to simulate chatbox
    context.save();
    context.translate(10, context.canvas.height - 10);
    this.drawOverheadText(context, scale, false, `${this.mobName()}: `);

    context.restore();
  }
}
