
import MissSplat from '../assets/images/hitsplats/miss.png'
import DamageSplat from '../assets/images/hitsplats/damage.png'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { clamp, remove, filter } from 'lodash'
import { Region } from './Region'
import { BasePrayer } from './Prayers/BasePrayer'
import { Projectile } from './Weapons/Projectile'
import { XpDrop } from './XpDrop'
import { Weapon } from './Weapons/Weapon'

export enum UnitTypes {
  MOB = 0,
  PLAYER = 1,
  ENTITY = 2,
}

export interface Location {
  x: number;
  y: number;
}

export interface WeaponsMap {
  [key: string]: Weapon
}

export interface UnitOptions {
  weapon?: Weapon;
  aggro?: Unit;
}

export interface UnitStats {
  attack: number;
  strength: number;
  defence: number;
  range: number;
  magic: number;
  hitpoint: number
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
}

export interface UnitTargetBonuses {
  undead: number;
  slayer: number;
}

export class Unit {

  region: Region;
  prayers: BasePrayer[];
  lastOverhead?: BasePrayer;
  aggro?: Unit;
  perceivedLocation: Location;
  location: Location;
  attackCooldownTicks: number;
  hasLOS: boolean;
  frozen: number;
  dying: number;
  incomingProjectiles: Projectile[];
  missedHitsplatImage: HTMLImageElement;
  damageHitsplatImage: HTMLImageElement;
  unitImage: HTMLImageElement;
  currentAnimation?: any;
  currentAnimationTickLength: number;
  currentStats: UnitStats;
  stats: UnitStats;
  bonuses: UnitBonuses;

  get type(): UnitTypes{
    return UnitTypes.MOB;
  }

  constructor (region: Region, location: Location, options?: UnitOptions) {
    this.region = region
    this.prayers = []
    this.lastOverhead = null
    this.aggro = options.aggro || null
    this.perceivedLocation = location
    this.location = location
    this.attackCooldownTicks = 0
    this.hasLOS = false
    this.frozen = 0
    // Number of ticks until NPC dies. If -1, the NPC is not dying.
    this.dying = -1
    this.incomingProjectiles = []

    this.missedHitsplatImage = new Image()
    this.missedHitsplatImage.src = MissSplat
    this.damageHitsplatImage = new Image()
    this.damageHitsplatImage.src = DamageSplat


    const unitImage = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size)
    unitImage.src = this.image
    unitImage.onload = () => {
      this.unitImage = unitImage;
    }

    this.currentAnimation = null
    this.currentAnimationTickLength = 0
    this.setStats()
    this.currentStats.hitpoint = this.stats.hitpoint

    if (options.weapon) {
      this.bonuses = options.weapon.bonuses // temp code
    }
  }

  grantXp(xpDrop: XpDrop) {
    
  }

  setStats(){
    
  }

  movementStep () {
  }

  attackStep (region: Region) {
  }

  draw(framePercent: number) {
    
    
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

  get size () {
    return 0
  }

  get image (): string {
    return null
  }

  isDying () {
    return (this.dying > 0)
  }

  removedFromRegion () {

  }

  // Returns true if the NPC can move towards the unit it is aggro'd against.
  canMove () {
    return (!this.hasLOS && this.frozen <= 0 && !this.isDying())
  }

  // TODO more modular
  get rangeAttackAnimation () {
    return null
  }

  get sound (): string {
    return null
  }

  get color (): string {
    return '#FFFFFF'
  }

  shouldShowAttackAnimation () {
    return this.attackCooldownTicks === this.cooldown && this.dying === -1
  }

  setHasLOS () {
    if (this.aggro === this.region.player) {
      this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(this.region, this.location.x, this.location.y, this.size, this.attackRange, true)
    } else if (this.type === UnitTypes.PLAYER) {
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(this.region, this.location.x, this.location.y, this.aggro, this.attackRange)
    } else if (this.aggro.type === UnitTypes.MOB) {
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(this.region, this.location.x, this.location.y, this.aggro, this.attackRange, this.type === UnitTypes.MOB)
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

  // Returns true if this mob is on the specified tile.
  isOnTile (x: number, y: number) {
    return (x >= this.location.x && x <= this.location.x + this.size) && (y <= this.location.y && y >= this.location.y - this.size)
  }

  // Returns the closest tile on this mob to the specified point.
  getClosestTileTo (x: number, y: number) {
    // We simply clamp the target point to our own boundary box.
    return [clamp(x, this.location.x, this.location.x + this.size), clamp(y, this.location.y, this.location.y - this.size)]
  }

  addProjectile (projectile: Projectile) {
    this.incomingProjectiles.push(projectile)
  }

  setLocation (location: Location) {
    this.location = location
  }

  setPrayers (prayers: BasePrayer[]) {
    this.prayers = prayers
  }

  attackAnimation (framePercent: number) {
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
      this.removedFromRegion()
    }
  }

  processIncomingAttacks () {
    this.incomingProjectiles = filter(this.incomingProjectiles, (projectile: Projectile) => projectile.delay > -1)
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.delay === 0) {
        this.currentStats.hitpoint -= projectile.damage
      }
      projectile.delay--
    })
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint)
  }

  drawHPBar () {
    this.region.ctx.fillStyle = 'red'
    this.region.ctx.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      Settings.tileSize * this.size,
      5
    )

    this.region.ctx.fillStyle = 'green'
    const w = (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size)
    this.region.ctx.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      w,
      5
    )
  }

  drawIncomingProjectiles () {
    let projectileOffsets = [
      [0, 12],
      [0, 28],
      [-14, 20],
      [14, 20]
    ]

    let projectileCounter = 0
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.delay > 0) {
        return
      }
      if (projectileCounter > 3) {
        return
      }
      projectileCounter++
      const image = (projectile.damage === 0) ? this.missedHitsplatImage : this.damageHitsplatImage
      if (!projectile.offsetX && !projectile.offsetY) {
        projectile.offsetX = projectileOffsets[0][0]
        projectile.offsetY = projectileOffsets[0][1]
      }

      projectileOffsets = remove(projectileOffsets, (offset) => {
        return offset[0] !== projectile.offsetX || offset[1] !== projectile.offsetY
      })

      this.region.ctx.drawImage(
        image,
        projectile.offsetX - 12,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY,
        24,
        23
      )
      this.region.ctx.fillStyle = '#FFFFFF'
      this.region.ctx.font = '16px Stats_11'
      this.region.ctx.textAlign = 'center'
      this.region.ctx.fillText(
        String(projectile.damage),
        projectile.offsetX,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY + 15
      )
      this.region.ctx.textAlign = 'left'
    })
  }

  drawOverheadPrayers () {
    const overheads = this.prayers.filter(prayer => prayer.isOverhead())
    if (overheads.length) {
      this.region.ctx.drawImage(
        overheads[0].overheadImage(),
        -Settings.tileSize / 2,
        -Settings.tileSize * 3,
        Settings.tileSize,
        Settings.tileSize
      )
    }
  }
}
