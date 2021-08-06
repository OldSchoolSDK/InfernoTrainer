'use strict'
import { Pathing } from './Pathing'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { minBy, range, filter, find, map, min, uniq, sumBy, times } from 'lodash'
import { Unit, UnitTypes, UnitStats, UnitBonuses, UnitOptions, UnitEquipment } from './Unit'
import { XpDropController } from './XpDropController'
import { World } from './World'
import { Weapon } from './gear/Weapon'
import { BasePrayer } from './BasePrayer'
import { XpDrop, XpDropAggregator } from './XpDrop'
import { Location } from './GameObject'
import { Mob } from './Mob'
import { ImageLoader } from './utils/ImageLoader'
import { MapController } from './MapController'
import { ControlPanelController } from './ControlPanelController'
import { Equipment } from './Equipment'
import { SetEffect } from './SetEffect'
import chebyshev from 'chebyshev'
import { ItemName } from './ItemName'
import { InventoryControls } from './controlpanels/InventoryControls'
import { Item } from './Item'
import { Collision } from './Collision'
import { Potion } from './gear/Potion'
import { Food } from './gear/Food'
import { Karambwan } from '../content/items/Karambwan'

export interface PlayerStats extends UnitStats {
  agility: number; 
  prayer: number
  run: number;
  specialAttack: number;
}

class PlayerEffects {
  poisoned: number = 0;
  venomed: number = 0;
  stamina: number = 0;
}

interface PlayerRegenTimers {
  spec: number;
  hitpoint: number;
}

class Eating {
  player: Player;
  foodDelay: number = 0;
  potionDelay: number = 0;
  comboDelay: number = 0;

  currentFood: Food;
  currentPotion: Potion;
  currentComboFood: Karambwan;
  redemptioned: boolean = false;

  tickFood(player: Player) {
    this.foodDelay--;
    this.potionDelay--;
    this.comboDelay--;
    if (this.currentFood) {
      this.currentFood.eat(player);
      player.attackCooldownTicks +=3;
      this.currentFood = null;
    }
    if (this.currentPotion) {
      this.currentPotion.drink(player);
      this.currentPotion = null;
    }
    if (this.currentComboFood) {
      this.currentComboFood.eat(player);
      player.attackCooldownTicks +=3;
      this.currentComboFood = null;
    }
    
  }

  checkRedemption(player: Player) {
    if (this.redemptioned) {
      player.currentStats.prayer = 0;
      player.currentStats.hitpoint += Math.floor(player.stats.prayer / 4);
      this.redemptioned = false;
    }
  }

  canEatFood(): boolean {
    return this.foodDelay <= 0;
  }

  canDrinkPotion(): boolean {
    return this.potionDelay <=0;
  }

  canEatComboFood(): boolean {
    return this.comboDelay <=0;
  }

  // The weird way that the lower tiers also eat the higher tiers forces the behavior of food -> potion -> karambwan
  eatFood(food: Food) {
    if (!this.canEatFood()) {
      return;
    }
    this.currentFood = food || null;
    this.foodDelay = 3;
    if (this.currentFood){
      this.currentFood.consumeItem(this.player);
    }
  }

  drinkPotion(potion: Potion) {
    if (!this.canDrinkPotion()) {
      return;
    }
    this.currentPotion = potion || null;
    this.foodDelay = 3;
    this.potionDelay = 3;
    if (this.currentPotion){
      this.currentPotion.doses--;
    }
  }

  eatComboFood(karambwan: Karambwan) {
    if (!this.canEatComboFood()) {
      return;
    }
    this.foodDelay = 3;
    this.potionDelay = 3;
    this.currentComboFood = karambwan || null;
    this.comboDelay = 3;
    if (this.currentComboFood){
      this.currentComboFood.consumeItem(this.player);
    }
  }
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
  regenTimers: PlayerRegenTimers;

  eats: Eating = new Eating();
  inventory: Item[] = new Array(28).fill(null);
  healedAmountThisTick: number = 0;

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.destinationLocation = location
    this.equipment = options.equipment;
    this.regenTimers = { spec: 50, hitpoint: 100 };
    this.equipmentChanged();
    this.clearXpDrops();
    this.autoRetaliate = false;
    this.eats.player = this;

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
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
      prayer: 99,
      agility: 99,
      run: 10000,
      specialAttack: 100
    }

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
      prayer: 99,
      agility: 99,
      run: 10000,
      specialAttack: 100
    }

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
    this.aggro = null
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
      this.aggro = null;
      this.destinationLocation = this.location;
    } else {
      // use equipped weapon
      if (this.equipment.weapon){
        if (this.equipment.weapon.hasSpecialAttack() && this.useSpecialAttack) {
          if (this.currentStats.specialAttack >= this.equipment.weapon.specialAttackDrain()) {
            this.equipment.weapon.specialAttack(this.world, this, this.aggro as Unit /* hack */)
            this.currentStats.specialAttack -= this.equipment.weapon.specialAttackDrain();
            if (this.regenTimers.spec <=0) {
              this.regenTimers.spec = 50;
            }
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

  pathToAggro () {
    if (this.aggro) {
      if (this.aggro.dying > -1) {
        this.aggro = null
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


    this.location = Pathing.path(this.world, this.location, this.destinationLocation, this.running ? 2 : 1, this.aggro)
}

  movementStep () {

  
    this.activatePrayers()

    this.pathToAggro()

    
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

  specRegen() {
    this.regenTimers.spec--;
    if (this.regenTimers.spec === 0) {
      this.regenTimers.spec = 50;
      this.currentStats.specialAttack += 10;
      this.currentStats.specialAttack = Math.min(100, this.currentStats.specialAttack);
    }
  }

  hitpointRegen() {
    this.regenTimers.hitpoint--;
    if (this.regenTimers.hitpoint === 0) {
      this.regenTimers.hitpoint = 100;
      this.currentStats.hitpoint++;
      this.currentStats.hitpoint = Math.min(this.stats.hitpoint, this.currentStats.hitpoint);
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

    this.specRegen();

    this.hitpointRegen();

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
      if (this.hasLOS && this.aggro && this.attackCooldownTicks <= 0) {
        this.attack()
        this.attackCooldownTicks = this.attackSpeed
      }
    }
  }

  
  draw (tickPercent: number) {
    LineOfSight.drawLOS(this.world, this.location.x, this.location.y, this.size, this.attackRange, '#00FF0055', this.type === UnitTypes.MOB)

    this.world.worldCtx.save();
    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)

    // Perceived location

    this.world.worldCtx.globalAlpha = 0.7
    this.world.worldCtx.fillStyle = '#FFFF00'
    this.world.worldCtx.fillRect(
      perceivedX * Settings.tileSize,
      perceivedY * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.world.worldCtx.globalAlpha = 1

    // Draw player on true tile
    this.world.worldCtx.fillStyle = '#fff'
    // feedback for when you shoot
    if (this.shouldShowAttackAnimation()) {
      this.world.worldCtx.fillStyle = '#00FFFF'
    }
    this.world.worldCtx.strokeStyle = '#FFFFFF73'
    this.world.worldCtx.lineWidth = 3
    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    // Destination location
    this.world.worldCtx.strokeStyle = '#FFFFFF73'
    this.world.worldCtx.lineWidth = 3
    this.world.worldCtx.strokeRect(
      this.destinationLocation.x * Settings.tileSize,
      this.destinationLocation.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.world.worldCtx.restore();
  }

  drawUILayer(tickPercent: number) {

    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)
    this.world.worldCtx.save();


    this.world.worldCtx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    if (Settings.rotated === 'south') {
      this.world.worldCtx.rotate(Math.PI)
    }
    this.drawHPBar()
    this.drawHitsplats()
    this.drawOverheadPrayers()
    this.world.worldCtx.restore();
    this.drawIncomingProjectiles(tickPercent);

  }
}
