'use strict'
import { every, LoDashImplicitNumberArrayWrapper, map } from 'lodash'

import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { Pathing } from './Pathing'

import { Weapon } from './gear/Weapon'
import { Unit, UnitBonuses, UnitOptions, UnitStats, UnitTypes } from './Unit'
import { World } from './World'
import { Location } from "./Location"
import { ImageLoader } from './utils/ImageLoader'
import { Collision } from './Collision'

export enum AttackIndicators {
  NONE = 0,
  HIT = 1,
  BLOCKED = 2,
  SCAN = 3,
}

export interface WeaponsMap {
  [key: string]: Weapon
}

export class Mob extends Unit {

  hasResurrected: boolean = false;
  attackFeedback: AttackIndicators;
  stats: UnitStats;
  currentStats: UnitStats;
  hadLOS: boolean;
  hasLOS: boolean;
  weapons: WeaponsMap;
  attackStyle: string;

  tcc: Location[];

  mobRangeAttackAnimation: any;

  get type () {
    return UnitTypes.MOB
  }

  canBeAttacked() {
    return true;
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

  }

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)

    if (!this.mobRangeAttackAnimation && this.rangeAttackAnimation !== null) {
      this.mobRangeAttackAnimation = map(this.rangeAttackAnimation, (image: any) => ImageLoader.createImage(image));
    }
  }

  get bonuses(): UnitBonuses {
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
        magicDamage: 0,
        prayer: 0
      }
    };
  }

  movementStep () {
    if (this.dying === 0) {
      return
    }
    this.processIncomingAttacks()

    this.spawnDelay--;
    if (this.spawnDelay > 0) {
      return;
    }
    this.perceivedLocation = { x: this.location.x, y: this.location.y }

    this.setHasLOS()
    if (this.canMove() && this.aggro) {
      let dx = this.location.x + Math.sign(this.aggro.location.x - this.location.x)
      let dy = this.location.y + Math.sign(this.aggro.location.y - this.location.y)

      if (Collision.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
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
      } else if (Collision.collisionMath(dx, dy, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
        // allows corner safespotting
        dy = this.location.y
      }

      if (this.attackCooldownTicks > this.cooldown) {
        // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
        dx = this.location.x
        dy = this.location.y
      }

      const xOff = dx - this.location.x;
      const yOff = this.location.y - dy;

      let xTiles = this.getXMovementTiles(xOff, yOff);
      let yTiles = this.getYMovementTiles(xOff, yOff);
      let xSpace = every(xTiles.map((location: Location) => Pathing.canTileBePathedTo(this.world, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
      let ySpace = every(yTiles.map((location: Location) => Pathing.canTileBePathedTo(this.world, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
      const both = xSpace && ySpace;

      if (!both) {
        xTiles = this.getXMovementTiles(xOff, 0);
        yTiles = this.getYMovementTiles(0, yOff);
        xSpace = every(xTiles.map((location: Location) => Pathing.canTileBePathedTo(this.world, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
        ySpace = every(yTiles.map((location: Location) => Pathing.canTileBePathedTo(this.world, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
      }

      this.tcc = xTiles.concat(yTiles);

      if (both) {
        this.location.x = dx
        this.location.y = dy
      } else if (xSpace && xTiles.length) {
        this.location.x = dx
      } else if (ySpace && yTiles.length) {
        this.location.y = dy
      }
    }
  }

  getXMovementTiles(xOff: number, yOff: number) {

    const xTiles = [];
    if (xOff === -1) {
      for (let i=0;i<this.size;i++){
        xTiles.push({
          x: this.location.x - 1,
          y: this.location.y - i - yOff
        })  
      }

    }else if (xOff === 1){
      for (let i=0;i<this.size;i++){
        xTiles.push({
          x: this.location.x + this.size,
          y: this.location.y - i - yOff
        })  
      }
    }
    return xTiles
  }

  getYMovementTiles(xOff: number, yOff: number) {

    const yTiles = [];
    if (yOff === -1) {
      for (let i=0;i<this.size;i++){
        yTiles.push({
          x: this.location.x + i + xOff,
          y: this.location.y + 1
        })  
      }
    }else if (yOff === 1){
      for (let i=0;i<this.size;i++){
        yTiles.push({
          x: this.location.x + i + xOff,
          y: this.location.y - this.size
        })  
      }
    }

    return yTiles;
  }
  // todo: Rename this possibly? it returns the attack style if it's possible
  canMeleeIfClose () {
    return ''
  }

  
  attackStep () {

    if (this.spawnDelay > 0) {
      return;
    }

    if (this.currentAnimationTickLength > 0) {
      if (--this.currentAnimationTickLength === 0) {
        this.currentAnimation = null
      }
    }

    if (this.dying === 0) {
      return
    }

    this.attackIfPossible()
    this.detectDeath()

    this.frozen--;
    this.stunned--;

  }

  attackStyleForNewAttack () {
    return 'slash'
  }

  attackIfPossible () {
    this.attackCooldownTicks--

    this.hadLOS = this.hasLOS
    this.setHasLOS()

    if (this.canAttack() === false) {
      return;
    }

    this.attackStyle = this.attackStyleForNewAttack()

    
    const weaponIsAreaAttack = this.weapons[this.attackStyle].isAreaAttack
    let isUnderAggro = false
    if (!weaponIsAreaAttack) {
      isUnderAggro = Collision.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)
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

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(this.attackStyle) === false) {
      if (this.isWithinMeleeRange() && Math.random() < 0.5) {
        this.attackStyle = this.canMeleeIfClose()
      }
    }

    if (this.weapons[this.attackStyle].isBlockable(this, this.aggro, { attackStyle: this.attackStyle })) {
      this.attackFeedback = AttackIndicators.BLOCKED
    } else {
      this.attackFeedback = AttackIndicators.HIT
    }
    this.weapons[this.attackStyle].attack(this.world, this, this.aggro as Unit /* hack */, { attackStyle: this.attackStyle, magicBaseSpellDamage: this.magicMaxHit() })

    // hack hack
    if (this.attackStyle === 'range' && !this.currentAnimation && this.mobRangeAttackAnimation) {
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
      let attemptedVolume = 1 / Pathing.dist(this.location.x, this.location.y, this.world.player.location.x, this.world.player.location.y);
      attemptedVolume = Math.min(1, Math.max(0, attemptedVolume))
      sound.volume = attemptedVolume;
      sound.play()
    }
  }

  get combatLevel () {
    return 99
  }

  get combatLevelColor () {
    return 'red'
  }

  contextActions (world: World, x: number, y: number) {
    return [
      {
        text: [{ text: 'Attack ', fillStyle: 'white' }, { text: this.mobName(), fillStyle: 'yellow' }, { text: ` (level ${this.combatLevel})`, fillStyle: this.combatLevelColor }],
        action: () => {
          this.world.viewport.clickController.redClick()
          this.world.viewport.clickController.sendToServer(() => this.world.viewport.clickController.playerAttackClick(this))
        }
      }
    ]
  }

  drawOverTile(tickPercent: number) {
    
  }

  drawUnderTile(tickPercent: number) {
    this.world.region.context.fillStyle = '#00000000';
    if (Settings.displayFeedback){
      if (this.dying > -1) {
        this.world.region.context.fillStyle = '#964B0073'
      } else if (this.attackFeedback === AttackIndicators.BLOCKED) {
        this.world.region.context.fillStyle = '#00FF0073'
      } else if (this.attackFeedback === AttackIndicators.HIT) {
        this.world.region.context.fillStyle = '#FF000073'
      } else if (this.attackFeedback === AttackIndicators.SCAN) {
        this.world.region.context.fillStyle = '#FFFF0073'
      } else if (this.hasLOS) {
        this.world.region.context.fillStyle = '#FF730073'
      } else {
        this.world.region.context.fillStyle = this.color;
      }  
    }
    // Draw mob
    this.world.region.context.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

  
  draw (tickPercent: number) {
    if (Settings.displayMobLoS){
      LineOfSight.drawLOS(this.world, this.location.x, this.location.y, this.size, this.attackRange, '#FF000055', this.type === UnitTypes.MOB)
    }

    
    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)
    this.world.region.context.save()
    this.world.region.context.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    this.drawUnderTile(tickPercent)
    let currentImage = this.unitImage

    if (Settings.rotated === 'south') {
      this.world.region.context.rotate(Math.PI)
    }
    if (Settings.rotated === 'south') {
      this.world.region.context.scale(-1, 1)
    }

    this.world.region.context.save()
    if (this.shouldShowAttackAnimation()) {
      this.attackAnimation(tickPercent)
    }

    if (currentImage){
      this.world.region.context.drawImage(
        currentImage,
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      )

    }

    this.world.region.context.restore()

    if (Settings.rotated === 'south') {
      this.world.region.context.scale(-1, 1)
    }

    this.drawOverTile(tickPercent)

    if (this.aggro) {

      if (LineOfSight.playerHasLineOfSightOfMob(this.world, this.aggro.location.x, this.aggro.location.y, this, this.world.player.attackRange)) {
        this.world.region.context.strokeStyle = '#00FF0073'
        this.world.region.context.lineWidth = 1
        this.world.region.context.strokeRect(
          -(this.size * Settings.tileSize) / 2,
          -(this.size * Settings.tileSize) / 2,
          this.size * Settings.tileSize,
          this.size * Settings.tileSize
        )
      }
    }


    this.world.region.context.restore()

    // if (!this.tcc) {
    //   return;
    // }
    // this.tcc.forEach((location: Location) => {
    //   this.world.region.context.fillStyle = '#00FF0073'
    //   this.world.region.context.fillRect(
    //     location.x * Settings.tileSize, location.y * Settings.tileSize,
    //     Settings.tileSize,
    //     Settings.tileSize
    //   )

    // })
  }
  drawUILayer(tickPercent: number) {
    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)
    this.world.region.context.save()
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

    this.world.region.context.restore()

    this.drawIncomingProjectiles(tickPercent)


  }
}
