'use strict'
import { Pathing } from './Pathing'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { minBy, range, filter, find, map, min, uniq, sumBy, times } from 'lodash'
import { Unit, UnitTypes, UnitBonuses, UnitOptions, UnitEquipment } from './Unit'
import { XpDropController } from './XpDropController'
import { World } from './World'
import { Weapon } from './gear/Weapon'
import { BasePrayer } from './BasePrayer'
import { XpDrop, XpDropAggregator } from './XpDrop'
import { Location } from "./Location"
import { Mob } from './Mob'
import { ImageLoader } from './utils/ImageLoader'
import { MapController } from './MapController'
import { ControlPanelController } from './ControlPanelController'
import { Equipment } from './Equipment'
import { SetEffect } from './SetEffect'
import chebyshev from 'chebyshev'
import { ItemName } from './ItemName'
import { Item } from './Item'
import { Collision } from './Collision'
import { Eating } from './Eating'
import { PlayerStats } from './PlayerStats'
import { PlayerRegenTimer } from './PlayerRegenTimers'

class PlayerEffects {
  poisoned: number = 0;
  venomed: number = 0;
  stamina: number = 0;
}

export class Player extends Unit {
  weapon?: Weapon;
  manualSpellCastSelection: Weapon;
  destinationLocation?: Location;

  stats: PlayerStats;
  currentStats: PlayerStats;
  xpDrops: XpDropAggregator;
  overhead: BasePrayer;
  running = true;
  prayerDrainCounter: number = 0;
  cachedBonuses: UnitBonuses = null;
  useSpecialAttack: boolean = false;
  effects = new PlayerEffects();
  regenTimer: PlayerRegenTimer = new PlayerRegenTimer(this);

  eats: Eating = new Eating();
  inventory: Item[];
  healedAmountThisTick: number = 0;

  seekingItem: Item = null;

  path: any;

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.destinationLocation = location
    this.equipment = options.equipment;
    this.equipmentChanged();
    this.clearXpDrops();
    this.autoRetaliate = false;
    this.eats.player = this;
    this.inventory = options.inventory || new Array(28).fill(null);

    ImageLoader.onAllImagesLoaded(() => MapController.controller.updateOrbsMask(this.currentStats, this.stats)  )

  }


  openInventorySlots(): number[] {
    const openSpots = [];
    for (let i=0; i<28; i++) {
      if (!this.inventory[i]) {
        openSpots.push(i);
      }
    }
    return openSpots;
  }


  postAttacksEvent() {
    this.eats.checkRedemption(this);
  }

  eatFood(amount: number) {
    this.healedAmountThisTick +=amount;
  }

  equipmentChanged() {

    let gear = [
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
    ]


    // updated gear bonuses
    this.cachedBonuses = Unit.emptyBonuses();
    gear.forEach((gear: Equipment) => {
      if (gear && gear.bonuses){
        this.cachedBonuses = Unit.mergeEquipmentBonuses(this.cachedBonuses, gear.bonuses);
      }
    })


    // update set effects
    const allSetEffects = [];
    gear.forEach((equipment: Equipment) => {
      if (equipment && equipment.equipmentSetEffect){
        allSetEffects.push(equipment.equipmentSetEffect)
      }
    })
    const completeSetEffects = [];
    uniq(allSetEffects).forEach((setEffect: typeof SetEffect) => {
      const itemsInSet = setEffect.itemsInSet();
      let setItemsEquipped = 0;
      find(itemsInSet, (itemName: string) => {
        gear.forEach((equipment: Equipment) => {
          if (!equipment){
            return;
          }
          if (itemName === equipment.itemName){
            setItemsEquipped++;
          }
        });
      })
      if (itemsInSet.length === setItemsEquipped) {
        completeSetEffects.push(setEffect)
      }
    });
    this.setEffects = completeSetEffects;
  }

  get bonuses(): UnitBonuses {
    return this.cachedBonuses;
  }

  setStats () {
    // non boosted numbers
    this.stats = Settings.player_stats;

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(Settings.player_stats))
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
    ]
    gear = gear.concat(this.inventory)
    gear = filter(gear)

    const kgs = Math.max(Math.min(64,sumBy(gear, 'weight')), 0)
    return kgs;
  }

  get prayerDrainResistance(): number {
    // https://oldschool.runescape.wiki/w/Prayer#Prayer_drain_mechanics
    return 2 * this.bonuses.other.prayer + 60;
  }
  
  get type () {
    return UnitTypes.PLAYER
  }

  clearXpDrops() {
    this.xpDrops = {};
  }

  grantXp(xpDrop: XpDrop) {
    if (!this.xpDrops[xpDrop.skill]){
      this.xpDrops[xpDrop.skill] = 0;
    }
    this.xpDrops[xpDrop.skill] += xpDrop.xp;
  }

  sendXpToController() {
    Object.keys(this.xpDrops).forEach((skill) => {
      XpDropController.controller.registerXpDrop({ skill, xp: Math.ceil(this.xpDrops[skill])});
    })
    
    this.clearXpDrops();
  }

  moveTo (x: number, y: number) {
    this.setAggro(null);

    this.manualSpellCastSelection = null

    const clickedOnEntities = Collision.collideableEntitiesAtPoint(this.world, x, y, 1)
    if (clickedOnEntities.length) {
      // Clicked on an entity, scan around to find the best spot to actually path to
      const clickedOnEntity = clickedOnEntities[0]
      const maxDist = Math.ceil(clickedOnEntity.size / 2)
      let bestDistances = []
      let bestDistance = 9999
      for (let yOff = -maxDist; yOff < maxDist; yOff++) {
        for (let xOff = -maxDist; xOff < maxDist; xOff++) {
          const potentialX = x + xOff
          const potentialY = y + yOff
          const e = Collision.collideableEntitiesAtPoint(this.world, potentialX, potentialY, 1)
          if (e.length === 0) {
            const distance = Pathing.dist(potentialX, potentialY, x, y)
            if (distance <= bestDistance) {
              if (bestDistances[0] && bestDistances[0].bestDistance > distance) {
                bestDistance = distance
                bestDistances = []
              }
              bestDistances.push({ x: potentialX, y: potentialY, bestDistance })
            }
          }
        }
      }
      const winner = minBy(bestDistances, (distance) => Pathing.dist(distance.x, distance.y, this.location.x, this.location.y))
      if (winner) {
        this.destinationLocation = { x: winner.x, y: winner.y }
      }
    } else {
      this.destinationLocation = { x, y }
    }
  }

  dead () {
    document.body.style.background = 'red'
  }

  attack () {
    if (this.manualSpellCastSelection) {
      const target = this.aggro;
      this.manualSpellCastSelection.cast(this.world, this, target)
      this.manualSpellCastSelection = null
      this.setAggro(null);
      this.destinationLocation = this.location;
    } else {
      // use equipped weapon
      if (this.equipment.weapon){
        if (this.equipment.weapon.hasSpecialAttack() && this.useSpecialAttack) {
          if (this.currentStats.specialAttack >= this.equipment.weapon.specialAttackDrain()) {
            this.equipment.weapon.specialAttack(this.world, this, this.aggro as Unit /* hack */)
            this.currentStats.specialAttack -= this.equipment.weapon.specialAttackDrain();
            this.regenTimer.specUsed();
          }
          this.useSpecialAttack  = false;
        }else{
          this.equipment.weapon.attack(this.world, this, this.aggro as Unit /* hack */)
        }
      }else{
        console.log('TODO: Implement punching')
      }
    }

    // this.playAttackSound();
  }

  activatePrayers () {
    this.lastOverhead = this.overhead
    this.overhead = find(this.world.player.prayers, (prayer: BasePrayer) => prayer.isOverhead() && prayer.isActive)
    if (this.lastOverhead && !this.overhead) {
      this.lastOverhead.playOffSound()
    } else if (this.lastOverhead !== this.overhead) {
      this.overhead.playOnSound()
    }
  }


  setAggro(mob: Unit) {
    this.aggro = mob;
    this.seekingItem = null;
  }

  setSeekingItem(item: Item) {
    this.aggro = null;
    this.seekingItem = item;
  }
  determineDestination () {
    if (this.aggro) {
      if (this.aggro.dying > -1) {
        this.setAggro(null);
        this.destinationLocation = this.location
        return
      }
      const isUnderAggrodMob = Collision.collisionMath(this.location.x, this.location.y, 1, this.aggro.location.x, this.aggro.location.y, this.aggro.size)
      this.setHasLOS()

      if (isUnderAggrodMob) {
        const maxDist = Math.ceil(this.aggro.size / 2)
        let bestDistance = 9999
        let winner = null
        for (let yy = -maxDist; yy < maxDist; yy++) {
          for (let xx = -maxDist; xx < maxDist; xx++) {
            const x = this.location.x + xx
            const y = this.location.y + yy
            if (Pathing.canTileBePathedTo(this.world, x, y, 1, {} as Mob)) {
              const distance = Pathing.dist(this.location.x, this.location.y, x, y)
              if (distance > 0 && distance < bestDistance) {
                bestDistance = distance
                winner = { x, y }
              }
            }
          }
        }
        if (winner) {
          this.destinationLocation = { x: winner.x, y: winner.y }
        } else {
          console.log("I don't understand what could cause this, but i'd like to find out")
        }
      } else if (!this.hasLOS) {

        const seekingTiles: Location[] = [];
        // "When clicking on an npc, object, or player, the requested tiles will be all tiles"
        // "within melee range of the npc, object, or player."
        // For implementation reasons we also ensure the north/south tiles are added to seekingTiles *first* so that
        // in cases of ties, the north and south tiles are picked by minBy below.
        const aggroSize = this.aggro.size;
        range(0, aggroSize).forEach(xx => {
          [-1, this.aggro.size].forEach(yy => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Collision.collidesWithAnyEntities(this.world, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py
              });
            }
          });
        });
        range(0, aggroSize).forEach(yy => {
          [-1, this.aggro.size].forEach(xx => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Collision.collidesWithAnyEntities(this.world, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py
              });
            }
          });
        });
        // Create paths to all npc tiles
        const potentialPaths = map(seekingTiles, (point) => Pathing.constructPath(this.world, this.location, { x: point.x, y: point.y }));
        const potentialPathLengths = map(potentialPaths, (path) => path.length);
        // Figure out what the min distance is
        const shortestPathLength = min(potentialPathLengths);
        // Get all of the paths of the same minimum distance (can be more than 1)
        const shortestPaths = filter(map(potentialPathLengths, (length, index) => (length === shortestPathLength) ? seekingTiles[index] : null));
        // Take the path that is the shortest absolute distance from player
        this.destinationLocation = minBy(shortestPaths, (point) => Pathing.dist(this.location.x, this.location.y, point.x, point.y));
      } else {
        this.destinationLocation = this.location
      }
    }else if (this.seekingItem) {
      this.destinationLocation = this.seekingItem.groundLocation;
    }
  }

  moveTorwardsDestination () {
    // Actually move the player

    this.perceivedLocation = this.location

    // Calculate run energy
    const dist = chebyshev([this.location.x, this.location.y], [this.destinationLocation.x, this.destinationLocation.y])
    if (this.running && dist > 1) {
      const runReduction = 67 + Math.floor(67 + Math.min(Math.max(0, this.weight), 64) / 64);
      if (this.effects.stamina) {
        this.currentStats.run -= Math.floor(0.3 * runReduction);
      }else if (this.equipment.ring && this.equipment.ring.itemName === ItemName.RING_OF_ENDURANCE){
        this.currentStats.run -= Math.floor(0.85 * runReduction);
      }else{
        this.currentStats.run -= runReduction;
      }
    }else{
      this.currentStats.run += Math.floor(this.currentStats.agility / 6) + 8
    }
    this.currentStats.run = Math.min(Math.max(this.currentStats.run, 0), 10000);
    if (this.currentStats.run === 0) {
      this.running = false;
    }
    this.effects.stamina--;
    this.effects.stamina = Math.min(Math.max(this.effects.stamina, 0), 200);


    const path = Pathing.path(this.world, this.location, this.destinationLocation, this.running ? 2 : 1, this.aggro); 
    this.location = { x: path.x, y: path.y }

    this.path = path.path;

  }

  takeSeekingItem() {
    if (this.seekingItem) {
      if (this.seekingItem.groundLocation.x === this.location.x) {
        if (this.seekingItem.groundLocation.y === this.location.y) {
          // Verify player is close. Apparently we need to have the player keep track of this item 
          this.world.region.removeGroundItem(this.seekingItem, this.location.x, this.location.y)
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

  movementStep () {

    this.activatePrayers()

    this.takeSeekingItem();

    this.determineDestination()
    
    this.moveTorwardsDestination()
  }

  get attackRange () {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackRange
    }
    if (this.equipment.weapon){
      return this.equipment.weapon.attackRange
    }
    return 1;
  }

  get attackSpeed () {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackSpeed
    }
    if (this.equipment.weapon){
      return this.equipment.weapon.attackSpeed
    }
    return 4;
  }

  drainPrayer() {
    const prayerDrainThisTick = ControlPanelController.controls.PRAYER.getCurrentActivePrayers().reduce((a, b) => a + b.drainRate(), 0)
    this.prayerDrainCounter += prayerDrainThisTick;
    while (this.prayerDrainCounter > this.prayerDrainResistance) {
      this.currentStats.prayer--;
      this.prayerDrainCounter -= this.prayerDrainResistance;
    }
    if (this.currentStats.prayer <= 0){
      ControlPanelController.controls.PRAYER.getCurrentActivePrayers().forEach((prayer) => prayer.deactivate())
      this.currentStats.prayer = 0;
    }
  }

  damageTaken() {
    const hasRedemptionActive = filter(ControlPanelController.controls.PRAYER.getCurrentActivePrayers().map((prayer) => {
      if (prayer.name === 'Redemption') {
        return prayer;
      }
      return null;
    })).length > 0

    if (hasRedemptionActive && this.currentStats.hitpoint > 0 && this.currentStats.hitpoint < Math.floor(this.stats.hitpoint / 10)){
      this.eats.redemptioned = true;
    }
  }
  
  attackStep () {
    
    this.drainPrayer();


    this.clearXpDrops();

    this.attackIfPossible()

    this.processIncomingAttacks()

    this.eats.tickFood(this);

    this.regenTimer.regen();

    this.detectDeath();

    this.sendXpToController();

    if (this.world.mapController){
      this.world.mapController.updateOrbsMask(this.currentStats, this.stats);
    }
  }

  attackIfPossible () {
    this.attackCooldownTicks--

    if (this.canAttack() === false) {
      return;
    }
    
    if (this.aggro) {
      this.setHasLOS()
      if (this.hasLOS && this.aggro && this.attackCooldownTicks <= 0 && this.aggro.isDying() === false) {
        this.attack()
        this.attackCooldownTicks = this.attackSpeed
      }
    }
  }

  
  draw (tickPercent: number) {
    LineOfSight.drawLOS(this.world, this.location.x, this.location.y, this.size, this.attackRange, '#00FF0055', this.type === UnitTypes.MOB)

    this.world.region.context.save();
    const perceivedLocation = this.getPerceivedLocation(tickPercent);
    const perceivedX = perceivedLocation.x;
    const perceivedY = perceivedLocation.y;

    // Perceived location

    this.world.region.context.globalAlpha = 0.7
    this.world.region.context.fillStyle = '#FFFF00'
    this.world.region.context.fillRect(
      perceivedX * Settings.tileSize,
      perceivedY * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.world.region.context.globalAlpha = 1

    // Draw player on true tile
    this.world.region.context.fillStyle = '#ffffff73'
    // feedback for when you shoot
    if (this.shouldShowAttackAnimation()) {
      this.world.region.context.fillStyle = '#00FFFF'
    }
    this.world.region.context.strokeStyle = '#FFFFFF73'
    this.world.region.context.lineWidth = 3
    this.world.region.context.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    // Destination location
    this.world.region.context.strokeStyle = '#FFFFFF73'
    this.world.region.context.lineWidth = 3
    this.world.region.context.strokeRect(
      this.destinationLocation.x * Settings.tileSize,
      this.destinationLocation.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.world.region.context.restore();
  }

  getPerceivedLocation(tickPercent: number): Location {

    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)

    if (this.path && this.path.length === 2) {
      if (tickPercent < 0.5) {
        perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.path[0].x, tickPercent * 2)
        perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.path[0].y, tickPercent * 2) 
      }else{
        perceivedX = Pathing.linearInterpolation(this.path[0].x, this.location.x, (tickPercent - 0.5) * 2)
        perceivedY = Pathing.linearInterpolation(this.path[0].y, this.location.y, (tickPercent - 0.5) * 2)
      }
    }
    return {
      x: perceivedX,
      y: perceivedY
    }
  }

  drawUILayer(tickPercent: number) {
    const perceivedLocation = this.getPerceivedLocation(tickPercent);
    const perceivedX = perceivedLocation.x;
    const perceivedY = perceivedLocation.y;
    
    this.world.region.context.save();


    this.world.region.context.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    if (Settings.rotated === 'south') {
      this.world.region.context.rotate(Math.PI)
    }
    this.drawHPBar()
    this.drawHitsplats()
    this.drawOverheadPrayers()
    this.world.region.context.restore();
    this.drawIncomingProjectiles(tickPercent);

  }
}
