'use strict'
import { map } from 'lodash'

import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { Pathing } from './Pathing'

import { Weapon } from './Weapons/Weapon'
import { Unit, UnitBonuses, UnitOptions, UnitStats, UnitTypes, WeaponsMap } from './Unit'
import { Region } from './Region'
import { Location } from './GameObject'

export enum AttackIndicators {
  NONE = 0,
  HIT = 1,
  BLOCKED = 2,
  SCAN = 3,
}

export class Mob extends Unit {

  hasResurrected: boolean = false;
  attackFeedback: AttackIndicators;
  stats: UnitStats;
  currentStats: UnitStats;
  bonuses: UnitBonuses;
  hadLOS: boolean;
  hasLOS: boolean;
  weapons: WeaponsMap;

  mobRangeAttackAnimation: any;

  get type () {
    return UnitTypes.MOB
  }

  setStats () {
    // non boosted numbers
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    }

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    }

    this.bonuses = {
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
        magicDamage: 0,
        prayer: 0
      }
    }
  }

  constructor (region: Region, location: Location, options: UnitOptions) {
    super(region, location, options)

    if (!this.mobRangeAttackAnimation && this.rangeAttackAnimation !== null) {
      this.mobRangeAttackAnimation = map(this.rangeAttackAnimation, (image: any) => {
        const img = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size)
        img.src = image
        return img
      })
    }
  }

  movementStep () {
    if (this.dying === 0) {
      return
    }
    this.perceivedLocation = { x: this.location.x, y: this.location.y }

    this.setHasLOS()
    if (this.canMove()) {
      let dx = this.location.x + Math.sign(this.aggro.location.x - this.location.x)
      let dy = this.location.y + Math.sign(this.aggro.location.y - this.location.y)

      if (Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
        // Random movement if player is under the mob.
        if (Math.random() < 0.5) {
          dy = this.location.y
          if (Math.random() < 0.5) {
            dx = this.location.x + 1
          } else {
            dx = this.location.x - 1
          }
        } else {
          dx = this.location.x
          if (Math.random() < 0.5) {
            dy = this.location.y + 1
          } else {
            dy = this.location.y - 1
          }
        }
      } else if (Pathing.collisionMath(dx, dy, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
        // allows corner safespotting
        dy = this.location.y
      }

      if (this.attackCooldownTicks > this.cooldown) {
        // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
        dx = this.location.x
        dy = this.location.y
      }

      const both = Pathing.canTileBePathedTo(this.region, dx, dy, this.size, this.consumesSpace as Mob)
      const xSpace = Pathing.canTileBePathedTo(this.region, dx, this.location.y, this.size, this.consumesSpace as Mob)
      const ySpace = Pathing.canTileBePathedTo(this.region, this.location.x, dy, this.size, this.consumesSpace as Mob)
      const cornerFilter = this.size > 1 ? (xSpace || ySpace) : (xSpace && ySpace)
      if (both && cornerFilter) {
        this.location.x = dx
        this.location.y = dy
      } else if (xSpace) {
        this.location.x = dx
      } else if (ySpace) {
        this.location.y = dy
      }
    }

    this.frozen--
  }

  // todo: Rename this possibly? it returns the attack style if it's possible
  canMeleeIfClose () {
    return ''
  }

  attackStep (region: Region) {
    if (this.currentAnimationTickLength > 0) {
      if (--this.currentAnimationTickLength === 0) {
        this.currentAnimation = null
      }
    }

    if (this.dying === 0) {
      return
    }

    this.processIncomingAttacks()
    this.attackIfPossible()
    this.detectDeath()
  }

  get attackStyle () {
    return 'slash'
  }

  attackIfPossible () {
    this.attackCooldownTicks--

    this.hadLOS = this.hasLOS
    this.setHasLOS()

    const weaponIsAreaAttack = this.weapons[this.attackStyle].isAreaAttack
    let isUnderAggro = false
    if (!weaponIsAreaAttack) {
      isUnderAggro = Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)
    }
    this.attackFeedback = AttackIndicators.NONE

    if (!isUnderAggro && this.hasLOS && this.attackCooldownTicks <= 0) {
      this.attack()
    }
  }

  magicMaxHit () {
    return 0
  }

  attack () {
    let attackStyle = this.attackStyle

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(attackStyle) === false) {
      if (this.isWithinMeleeRange() && Math.random() < 0.5) {
        attackStyle = this.canMeleeIfClose()
      }
    }

    if (this.weapons[attackStyle].isBlockable(this, this.aggro, { attackStyle })) {
      this.attackFeedback = AttackIndicators.BLOCKED
    } else {
      this.attackFeedback = AttackIndicators.HIT
    }
    this.weapons[attackStyle].attack(this.region, this, this.aggro, { attackStyle, magicBaseSpellDamage: this.magicMaxHit() })

    // hack hack
    if (attackStyle === 'range' && !this.currentAnimation && this.mobRangeAttackAnimation) {
      this.currentAnimation = this.mobRangeAttackAnimation
      this.currentAnimationTickLength = 1
    }

    this.playAttackSound()

    this.attackCooldownTicks = this.cooldown
  }

  get consumesSpace (): Unit {
    return this
  }

  playAttackSound () {
    if (Settings.playsAudio) {
      const sound = new Audio(this.sound)
      sound.volume = 1 / Pathing.dist(this.location.x, this.location.y, this.region.player.location.x, this.region.player.location.y)
      sound.play()
    }
  }

  get displayName () {
    return 'Jal-No-Name'
  }

  get combatLevel () {
    return 99
  }

  get combatLevelColor () {
    return 'red'
  }

  contextActions (x: number, y: number) {
    return [
      {
        text: [{ text: 'Attack ', fillStyle: 'white' }, { text: this.displayName, fillStyle: 'yellow' }, { text: ` (level ${this.combatLevel})`, fillStyle: this.combatLevelColor }],
        action: () => {
          this.region.redClick()
          this.region.playerAttackClick(this)
        }
      }
    ]
  }

  draw (framePercent: number) {
    LineOfSight.drawLOS(this.region, this.location.x, this.location.y, this.size, this.attackRange, '#FF000055', this.type === UnitTypes.MOB)

    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent)
    this.region.ctx.save()
    this.region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    if (this.dying > -1) {
      this.region.ctx.fillStyle = '#964B00'
    } else if (this.attackFeedback === AttackIndicators.BLOCKED) {
      this.region.ctx.fillStyle = '#00FF00'
    } else if (this.attackFeedback === AttackIndicators.HIT) {
      this.region.ctx.fillStyle = '#FF0000'
    } else if (this.attackFeedback === AttackIndicators.SCAN) {
      this.region.ctx.fillStyle = '#FFFF00'
    } else if (this.hasLOS) {
      this.region.ctx.fillStyle = '#FF7300'
    } else {
      this.region.ctx.fillStyle = '#FFFFFF22'
    }

    // Draw mob
    this.region.ctx.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )

    let currentImage = this.unitImage
    // if (this.currentAnimation !== null) {
    //   const animationLength = this.currentAnimation.length
    //   // TODO multi-tick animations.
    //   const currentFrame = Math.floor(framePercent * animationLength)
    //   if (currentFrame < animationLength) {
    //     currentImage = this.currentAnimation[currentFrame]
    //   } else {
    //     this.currentAnimation = null
    //   }
    // }

    this.region.ctx.restore()

    this.region.ctx.save()

    this.region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )
    if (Settings.rotated === 'south') {
      this.region.ctx.rotate(Math.PI)
    }
    if (Settings.rotated === 'south') {
      this.region.ctx.scale(-1, 1)
    }

    this.region.ctx.save()
    if (this.shouldShowAttackAnimation()) {
      this.attackAnimation(framePercent)
    }

    if (currentImage){
      this.region.ctx.drawImage(
        currentImage,
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      )

    }

    this.region.ctx.restore()

    if (Settings.rotated === 'south') {
      this.region.ctx.scale(-1, 1)
    }

    if (LineOfSight.hasLineOfSightOfMob(this.region, this.aggro.location.x, this.aggro.location.y, this, this.region.player.attackRange)) {
      this.region.ctx.strokeStyle = '#00FF0073'
      this.region.ctx.lineWidth = 1
      this.region.ctx.strokeRect(
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      )
    }

    this.drawHPBar()

    this.drawIncomingProjectiles()

    this.drawOverheadPrayers()

    this.region.ctx.restore()
  }
}
