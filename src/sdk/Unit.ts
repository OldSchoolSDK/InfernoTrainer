
import HealSplat from '../assets/images/hitsplats/heal.png'
import MissSplat from '../assets/images/hitsplats/miss.png'
import DamageSplat from '../assets/images/hitsplats/damage.png'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { remove, filter } from 'lodash'
import { World } from './World'
import { BasePrayer } from './BasePrayer'
import { Projectile } from './weapons/Projectile'
import { XpDrop } from './XpDrop'
import { GameObject } from './GameObject'
import { Location } from "./Location"
import { Pathing } from './Pathing'
import { ImageLoader } from './utils/ImageLoader'
import { Weapon } from './gear/Weapon'
import { Offhand } from './gear/Offhand';
import { Helmet } from './gear/Helmet';
import { Necklace } from './gear/Necklace';
import { Chest } from './gear/Chest';
import { Legs } from './gear/Legs';
import { Feet } from './gear/Feet';
import { Gloves } from './gear/Gloves';
import { Ring } from './gear/Ring';
import { Cape } from './gear/Cape';
import { Ammo } from './gear/Ammo';
import { SetEffect } from './SetEffect'
import { EntityName } from "./EntityName"
import { Item } from './Item'
import { PrayerController } from './PrayerController'
export enum UnitTypes {
  MOB = 0,
  PLAYER = 1,
  ENTITY = 2,
}

export class UnitEquipment {
  weapon?: Weapon = null
  offhand?: Offhand = null
  helmet?: Helmet = null
  necklace?: Necklace = null
  chest?: Chest = null
  legs?: Legs = null
  feet?: Feet = null
  gloves?: Gloves = null
  ring?: Ring = null
  cape?: Cape = null
  ammo?: Ammo = null
}

export interface UnitOptions {
  aggro?: GameObject;
  equipment?: UnitEquipment;
  spawnDelay?: number;
  cooldown?: number;
  inventory?: Item[];
}

export interface UnitStats {
  attack: number;
  strength: number;
  defence: number;
  range: number;
  magic: number;
  hitpoint: number;
}

export interface UnitBonuses {
  attack: UnitStyleBonuses;
  defence: UnitStyleBonuses;
  other: UnitOtherBonuses;
  targetSpecific?: UnitTargetBonuses
}

export interface UnitStyleBonuses {
  stab: number;
  slash: number;
  crush: number;
  magic: number;
  range: number;
}

export interface UnitOtherBonuses {
  meleeStrength: number;
  rangedStrength: number;
  magicDamage: number;
  prayer: number
  crystalAccuracy?: number;
  crystalDamage?: number;
}

export interface UnitTargetBonuses {
  undead: number;
  slayer: number;
}

export class Unit extends GameObject {

  world: World;
  prayerController: PrayerController;
  lastOverhead?: BasePrayer = null;
  aggro?: GameObject;
  perceivedLocation: Location;
  attackCooldownTicks: number = 0;
  hasLOS: boolean = false;
  frozen: number = 0;
  stunned: number = 0;
  incomingProjectiles: Projectile[] = [];
  healHitsplatImage: HTMLImageElement = ImageLoader.createImage(HealSplat);
  missedHitsplatImage: HTMLImageElement = ImageLoader.createImage(MissSplat);
  damageHitsplatImage: HTMLImageElement = ImageLoader.createImage(DamageSplat);
  unitImage: HTMLImageElement = ImageLoader.createImage(this.image);
  currentAnimation?: any = null;
  currentAnimationTickLength: number = 0;
  currentStats: UnitStats;
  stats: UnitStats;
  equipment: UnitEquipment = new UnitEquipment();
  setEffects: typeof SetEffect[] = [];
  autoRetaliate: boolean = false;
  spawnDelay: number = 0;

  get completeSetEffects(): SetEffect[] {
    return null;
  }

  get type(): UnitTypes{
    return UnitTypes.MOB;
  }

  mobName(): EntityName { 
    return null;
  }

  constructor (world: World, location: Location, options?: UnitOptions) {
    super()

    this.world = world
     this.aggro = options.aggro || null
    this.perceivedLocation = location
    this.location = location
    this.setStats()
    this.spawnDelay = options.spawnDelay || 0
    this.autoRetaliate = true;
    this.currentStats.hitpoint = this.stats.hitpoint

    if (options.cooldown) { 
      this.attackCooldownTicks = options.cooldown;
    }

  }


  setAggro(mob: Unit) {
    this.aggro = mob;
  }

  
  grantXp(xpDrop: XpDrop) { }
  setStats(){ }
  movementStep () { }
  attackStep () { }
  draw(tickPercent: number) { }
  drawUILayer(tickPercent: number) { }
  removedFromWorld () { }

  static mergeEquipmentBonuses(firstBonuses: UnitBonuses, secondBonuses: UnitBonuses): UnitBonuses{
    return {
      attack: {
        stab: firstBonuses.attack.stab + secondBonuses.attack.stab,
        slash: firstBonuses.attack.slash + secondBonuses.attack.slash,
        crush: firstBonuses.attack.crush + secondBonuses.attack.crush,
        magic: firstBonuses.attack.magic + secondBonuses.attack.magic,
        range: firstBonuses.attack.range + secondBonuses.attack.range
      },
      defence: {
        stab: firstBonuses.defence.stab + secondBonuses.defence.stab,
        slash: firstBonuses.defence.slash + secondBonuses.defence.slash,
        crush: firstBonuses.defence.crush + secondBonuses.defence.crush,
        magic: firstBonuses.defence.magic + secondBonuses.defence.magic,
        range: firstBonuses.defence.range + secondBonuses.defence.range
      },
      other: {
        meleeStrength: firstBonuses.other.meleeStrength + secondBonuses.other.meleeStrength,
        rangedStrength: firstBonuses.other.rangedStrength + secondBonuses.other.rangedStrength,
        magicDamage: firstBonuses.other.magicDamage + secondBonuses.other.magicDamage,
        prayer: firstBonuses.other.prayer + secondBonuses.other.prayer,
        crystalAccuracy: (firstBonuses.other.crystalAccuracy || 0) + (secondBonuses.other.crystalAccuracy || 0),
        crystalDamage: (firstBonuses.other.crystalDamage || 0) + (secondBonuses.other.crystalDamage || 0)
      },
      targetSpecific: {
        undead: firstBonuses.targetSpecific.undead + secondBonuses.targetSpecific.undead,
        slayer: firstBonuses.targetSpecific.slayer + secondBonuses.targetSpecific.slayer
      }
    };
  }

  static emptyBonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 1,
        prayer: 0,
        crystalAccuracy: 1,
        crystalDamage: 1,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    };
  }

  get bonuses(): UnitBonuses {
    return Unit.emptyBonuses();
  }

  get cooldown () {
    return 0
  }

  get attackRange () {
    return 0
  }

  get maxHit () {
    return 0
  }

  get image (): string {
    return null
  }

  // Returns true if the NPC can move towards the unit it is aggro'd against.
  canMove () {
    return (!this.hasLOS && !this.isFrozen() && !this.isStunned() && !this.isDying())
  }

  canAttack () {
    return !this.isDying() && !this.isStunned();
  }

  
  isFrozen() {
    return (this.frozen > 0)
  }

  isStunned () {
    return (this.stunned > 0)
  }

  // TODO more modular
  get rangeAttackAnimation () {
    return null
  }

  get sound (): string {
    return null
  }

  get color (): string {
    return '#FFFFFF00'
  }

  shouldShowAttackAnimation () {
    return this.attackCooldownTicks === this.cooldown && this.dying === -1 && this.isStunned() === false;
  }

  setHasLOS () {
    if (!this.aggro) {
      this.hasLOS = false;
      return;
    }
    if (this.aggro === this.world.player) {
      this.hasLOS = LineOfSight.mobHasLineOfSightOfPlayer(this.world, this.location.x, this.location.y, this.size, this.attackRange, true)
    } else if (this.type === UnitTypes.PLAYER) {
      this.hasLOS = LineOfSight.playerHasLineOfSightOfMob(this.world, this.location.x, this.location.y, this.aggro, this.attackRange)
    } else if (this.type === UnitTypes.MOB && this.aggro.type === UnitTypes.MOB) {
      this.hasLOS = LineOfSight.mobHasLineOfSightToMob(this.world, this, this.aggro, this.attackRange)
    } else if (this.aggro.type === UnitTypes.MOB) {
      this.hasLOS = LineOfSight.playerHasLineOfSightOfMob(this.world, this.location.x, this.location.y, this.aggro, this.attackRange, this.type === UnitTypes.MOB)
    } else if (this.aggro.type === UnitTypes.ENTITY) {
      this.hasLOS = false
    }
  }

  // Returns true if this mob is in melee range of its target.
  isWithinMeleeRange () {
    const targetX = this.aggro.location.x
    const targetY = this.aggro.location.y
    let isWithinMeleeRange = false

    if (targetX === this.location.x - 1 && (targetY <= this.location.y + 1 && targetY > this.location.y - this.size - 1)) {
      isWithinMeleeRange = true
    } else if (targetY === this.location.y + 1 && (targetX >= this.location.x && targetX < this.location.x + this.size)) {
      isWithinMeleeRange = true
    } else if (targetX === this.location.x + this.size && (targetY <= this.location.y + 1 && targetY > this.location.y - this.size - 1)) {
      isWithinMeleeRange = true
    } else if (targetY === this.location.y - this.size && (targetX >= this.location.x && targetX < this.location.x + this.size)) {
      isWithinMeleeRange = true
    }
    return isWithinMeleeRange
  }


  addProjectile (projectile: Projectile) {
    if (this.spawnDelay > 0 && this.autoRetaliate && !this.aggro){
      this.setAggro(projectile.from);
    }
    this.incomingProjectiles.push(projectile)
  }

  setLocation (location: Location) {
    this.location = location
  }

  attackAnimation (tickPercent: number) {
    // override pls
  }

  dead () {
    this.perceivedLocation = this.location
    this.dying = 3
  }

  detectDeath () {
    if (this.dying === -1 && this.currentStats.hitpoint <= 0) {
      this.dead()
      return
    }

    if (this.dying > 0) {
      this.dying--
    }
    if (this.dying === 0) {
      this.removedFromWorld()
    }
  }

  processIncomingAttacks () {
    this.incomingProjectiles = filter(this.incomingProjectiles, (projectile: Projectile) => projectile.remainingDelay > -1)
    this.incomingProjectiles.forEach((projectile) => {
      
      projectile.currentLocation = {
        x: Pathing.linearInterpolation(projectile.currentLocation.x, projectile.to.location.x + projectile.to.size / 2, 1 / (projectile.remainingDelay + 1)),
        y: Pathing.linearInterpolation(projectile.currentLocation.y, projectile.to.location.y - projectile.to.size / 2 + 1, 1 / (projectile.remainingDelay + 1)),
      }        
      projectile.remainingDelay--

      if (projectile.remainingDelay === 0) {
        if (projectile.damage < 0) {
          // subtracting a negative gives a positive
          if (this.currentStats.hitpoint < this.stats.hitpoint) {
            this.currentStats.hitpoint -= projectile.damage
            this.currentStats.hitpoint = Math.min(this.currentStats.hitpoint, this.stats.hitpoint)
          }
        }else{
          this.currentStats.hitpoint -= projectile.damage
        }
        this.damageTaken();
        if (this.shouldChangeAggro(projectile)) {
          this.setAggro(projectile.from);

          if (this.attackCooldownTicks < Math.floor(this.cooldown / 2)){
            this.attackCooldownTicks = Math.floor(this.cooldown / 2);
          }
        }
      }
    })
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint)
    this.postAttacksEvent();
  }

  shouldChangeAggro(projectile: Projectile) {
    return !this.aggro && this.autoRetaliate
  }

  postAttacksEvent() {

  }

  damageTaken() {

  }

  drawHitsplat(projectile: Projectile): boolean { 
    return true;
  }

  drawHPBar () {
    this.world.region.context.fillStyle = 'red'
    this.world.region.context.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      Settings.tileSize * this.size,
      5
    )

    this.world.region.context.fillStyle = 'green'
    const w = Math.min(1, this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size)
    this.world.region.context.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      w,
      5
    )
  }

  drawHitsplats () {
    let projectileOffsets = [
      [0, 12],
      [0, 28],
      [-14, 20],
      [14, 20]
    ]

    let projectileCounter = 0
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.remainingDelay > 0) {
        return
      }
      if (projectileCounter > 3) {
        return
      }
      projectileCounter++
      if (this.drawHitsplat(projectile)) {
        let image = (projectile.damage === 0) ? this.missedHitsplatImage : this.damageHitsplatImage
        if (!projectile.offsetX && !projectile.offsetY) {
          projectile.offsetX = projectileOffsets[0][0]
          projectile.offsetY = projectileOffsets[0][1]
        }
  
        projectileOffsets = remove(projectileOffsets, (offset) => {
          return offset[0] !== projectile.offsetX || offset[1] !== projectile.offsetY
        })
        
        if (projectile.damage < 0) {
          image = this.healHitsplatImage;
        }
  
        this.world.region.context.drawImage(
          image,
          projectile.offsetX - 12,
          -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY,
          24,
          23
        )
        this.world.region.context.fillStyle = '#FFFFFF'
        this.world.region.context.font = '16px Stats_11'
        this.world.region.context.textAlign = 'center'
        this.world.region.context.fillText(
          String(Math.abs(projectile.damage)),
          projectile.offsetX,
          -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY + 15
        )
        this.world.region.context.textAlign = 'left'
      }

    })
  }

  drawOverheadPrayers () {

    if (!this.prayerController) {
      return;
    }
    
    const overhead = this.prayerController.overhead()
    if (overhead) {
      const overheadImg = overhead.overheadImage();
      if (overheadImg){
        this.world.region.context.drawImage(
          overheadImg,
          -Settings.tileSize / 2,
          -Settings.tileSize * 3,
          Settings.tileSize,
          Settings.tileSize
        )  
      }
    }
  }


  // The rendering context is the world.
  drawIncomingProjectiles(tickPercent: number) {

    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.options.hidden) {
        return;
      }

      if (projectile.remainingDelay < 0) {
        return;
      }

      let startX = projectile.currentLocation.x;
      let startY = projectile.currentLocation.y;
      let endX = projectile.to.location.x + projectile.to.size / 2;
      let endY = projectile.to.location.y - projectile.to.size / 2 + 1;

      let perceivedX = Pathing.linearInterpolation(startX, endX, tickPercent / (projectile.remainingDelay + 1));
      let perceivedY = Pathing.linearInterpolation(startY, endY, tickPercent / (projectile.remainingDelay + 1));
  
      this.world.region.context.save();
      this.world.region.context.translate(
        perceivedX * Settings.tileSize, 
        (perceivedY) * Settings.tileSize
      )
        

      if (projectile.image) {
        this.world.region.context.rotate(Math.PI)
        this.world.region.context.drawImage(
          projectile.image,
          -Settings.tileSize / 2, 
          -Settings.tileSize / 2,
          Settings.tileSize,
          Settings.tileSize
        );
      }else{
        this.world.region.context.beginPath()
        this.world.region.context.fillStyle = '#D1BB7773'
        this.world.region.context.arc(0, 0, 5, 0, 2 * Math.PI)
        this.world.region.context.fill()
      }
      this.world.region.context.restore();

      this.world.region.context.strokeRect(projectile.closestTile.x, projectile.closestTile.y, Settings.tileSize, Settings.tileSize);
      
    });
  }

}
