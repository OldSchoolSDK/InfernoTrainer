'use strict'
import { every } from 'lodash'

import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { Pathing } from './Pathing'

import { Weapon } from './gear/Weapon'
import { Unit, UnitBonuses, UnitStats, UnitTypes } from './Unit'
import { Location } from "./Location"
import { Collision } from './Collision'
import { SoundCache } from './utils/SoundCache';
import { Viewport } from './Viewport'
import { Random } from './Random'
import { Region } from './Region'
import { CommandStrength, QueueableCommand } from './CommandQueue'
import { CommandOpCodes } from './OpcodeBindings'

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
  static mobIdTracker = 0;
  mobId: number = Mob.mobIdTracker++;
  hasResurrected = false;
  attackFeedback: AttackIndicators;
  stats: UnitStats;
  currentStats: UnitStats;
  hadLOS: boolean;
  hasLOS: boolean;
  weapons: WeaponsMap;
  attackStyle: string;
  tcc: Location[];
  removableWithRightClick = false;

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
        if (Random.get() < 0.5) {
          dy = this.location.y
          if (Random.get() < 0.5) {
            dx = this.location.x + 1
          } else {
            dx = this.location.x - 1
          }
        } else {
          dx = this.location.x
          if (Random.get() < 0.5) {
            dy = this.location.y + 1
          } else {
            dy = this.location.y - 1
          }
        }
      } else if (Collision.collisionMath(dx, dy, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
        // allows corner safespotting
        dy = this.location.y
      }

      if (this.attackDelay > this.attackSpeed) {
        // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
        dx = this.location.x
        dy = this.location.y
      }

      const xOff = dx - this.location.x;
      const yOff = this.location.y - dy;

      let xTiles = this.getXMovementTiles(xOff, yOff);
      let yTiles = this.getYMovementTiles(xOff, yOff);
      let xSpace = every(xTiles.map((location: Location) => Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
      let ySpace = every(yTiles.map((location: Location) => Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
      const both = xSpace && ySpace;

      // if (this.mobName() === EntityName.JAL_AK){ 
      //   this.tcc =  xTiles; //xTiles.concat(yTiles);
      // }

      if (!both) {
        xTiles = this.getXMovementTiles(xOff, 0);
        xSpace = every(xTiles.map((location: Location) => Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
        if (!xSpace) {
          yTiles = this.getYMovementTiles(0, yOff);
          ySpace = every(yTiles.map((location: Location) => Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob)), Boolean)
        }        
      }

      if (both) {
        this.location.x = dx
        this.location.y = dy
      } else if (xSpace) {
        this.location.x = dx
      } else if (ySpace) {
        this.location.y = dy
      }
    }
  }

  getXMovementTiles(xOff: number, yOff: number) {

    const start = (yOff === -1) ? -1 : 0;
    const end = (yOff === 1) ? this.size + 1 : this.size;
    const xTiles = [];
    if (xOff === -1) {

      for (let i=start;i<end;i++){
        xTiles.push({
          x: this.location.x - 1,
          y: this.location.y - i
        })  
      }

    }else if (xOff === 1){


      for (let i=start;i<end;i++){
        xTiles.push({
          x: this.location.x + this.size,
          y: this.location.y - i
        })  
      }
    }
    return xTiles
  }

  getYMovementTiles(xOff: number, yOff: number) {

    const start = (xOff === -1) ? -1 : 0;
    const end = (xOff === 1) ? this.size + 1 : this.size;

    const yTiles = [];
    if (yOff === -1) {
      
      // south
      for (let i=start;i<end;i++){
        yTiles.push({
          x: this.location.x + i,
          y: this.location.y + 1
        })  
      }
    }else if (yOff === 1){

      // north
      for (let i=start;i<end;i++){
        yTiles.push({
          x: this.location.x + i,
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
    this.attackDelay--

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

    if (!isUnderAggro && this.hasLOS && this.attackDelay <= 0) {
      this.attack()
    }
  }

  magicMaxHit () {
    return 0
  }

  attack () {

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(this.attackStyle) === false) {
      if (this.isWithinMeleeRange() && Random.get() < 0.5) {
        this.attackStyle = this.canMeleeIfClose()
      }
    }

    if (this.weapons[this.attackStyle].isBlockable(this, this.aggro, { attackStyle: this.attackStyle })) {
      this.attackFeedback = AttackIndicators.BLOCKED
    } else {
      this.attackFeedback = AttackIndicators.HIT
    }
    this.weapons[this.attackStyle].attack(this, this.aggro as Unit /* hack */, { attackStyle: this.attackStyle, magicBaseSpellDamage: this.magicMaxHit() })

    

    this.playAttackSound()

    this.attackDelay = this.attackSpeed
  }

  get consumesSpace (): Unit {
    return this
  }

  playAttackSound () {
    if (Settings.playsAudio) {
      const sound = SoundCache.getCachedSound(this.sound);
      if (sound) {
        let attemptedVolume = 1 / Pathing.dist(this.location.x, this.location.y, this.aggro.location.x, this.aggro.location.y);
        attemptedVolume = Math.min(1, Math.max(0, attemptedVolume))
        sound.volume = attemptedVolume;
        sound.play()
      }
    }
  }

  get combatLevel () {
    return 99
  }

  contextActions (region: Region, x: number, y: number) {
    const actions = [
      {
        text: [{ text: 'Attack ', fillStyle: 'white' }, { text: this.mobName(), fillStyle: 'yellow' }, { text: ` (level ${this.combatLevel})`, fillStyle: Viewport.viewport.player.combatLevelColor(this) }],
        action: () => {
          Viewport.viewport.clickController.redClick()
          
          Viewport.viewport.player.commandQueue.enqueue(
            QueueableCommand.create(CommandOpCodes.ATTACK, CommandStrength.STRONG, 0, { target: this }),
          );  
        }
      }
    ];

    // hack hack hack

    if (this.removableWithRightClick) {
      actions.push(
        {
          text: [{ text: 'Remove ', fillStyle: 'white' }, { text: this.mobName(), fillStyle: 'yellow' }, { text: ` (level ${this.combatLevel})`, fillStyle: Viewport.viewport.player.combatLevelColor(this) }],
          action: () => {
            this.region.removeMob(this);
          }
        }
      );
    }

    return actions;
  }


  drawOverTile(tickPercent: number) {
    // Override me
  }

  drawUnderTile(tickPercent: number) {
    this.region.context.fillStyle = '#00000000';
    if (Settings.displayFeedback){
      if (this.dying > -1) {
        this.region.context.fillStyle = '#964B0073'
      } else if (this.attackFeedback === AttackIndicators.BLOCKED) {
        this.region.context.fillStyle = '#00FF0073'
      } else if (this.attackFeedback === AttackIndicators.HIT) {
        this.region.context.fillStyle = '#FF000073'
      } else if (this.attackFeedback === AttackIndicators.SCAN) {
        this.region.context.fillStyle = '#FFFF0073'
      } else if (this.hasLOS) {
        this.region.context.fillStyle = '#FF730073'
      } else {
        this.region.context.fillStyle = this.color;
      }  
    }
    // Draw mob
    this.region.context.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

  
  draw (tickPercent: number) {
    if (Settings.displayMobLoS){
      LineOfSight.drawLOS(this.region, this.location.x, this.location.y, this.size, this.attackRange, '#FF000055', this.type === UnitTypes.MOB)
    }

    
    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)
    this.region.context.save()
    this.region.context.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    this.drawUnderTile(tickPercent)
    const currentImage = this.unitImage

    if (Settings.rotated === 'south') {
      this.region.context.rotate(Math.PI)
    }
    if (Settings.rotated === 'south') {
      this.region.context.scale(-1, 1)
    }

    this.region.context.save()
    if (this.shouldShowAttackAnimation()) {
      this.attackAnimation(tickPercent)
    }

    if (currentImage){
      this.region.context.drawImage(
        currentImage,
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      )

    }

    this.region.context.restore()

    if (Settings.rotated === 'south') {
      this.region.context.scale(-1, 1)
    }

    this.drawOverTile(tickPercent)

    if (this.aggro) {

      const unit = this.aggro as Unit;

      if (LineOfSight.playerHasLineOfSightOfMob(this.region, this.aggro.location.x, this.aggro.location.y, this, unit.attackRange)) {
        this.region.context.strokeStyle = '#00FF0073'
        this.region.context.lineWidth = 1
        this.region.context.strokeRect(
          -(this.size * Settings.tileSize) / 2,
          -(this.size * Settings.tileSize) / 2,
          this.size * Settings.tileSize,
          this.size * Settings.tileSize
        )
      }
    }


    this.region.context.restore()

    if (!this.tcc) {
      return;
    }
    // if (this.mobName() !== EntityName.JAL_AK) {
    //   return;
    // }
    // if (this.mobId !== 4) {
    //   return;
    // }
    this.tcc.forEach((location: Location) => {
      this.region.context.fillStyle = '#00FF0073'
      this.region.context.fillRect(
        location.x * Settings.tileSize, location.y * Settings.tileSize,
        Settings.tileSize,
        Settings.tileSize
      )

    })
  }
  drawUILayer(tickPercent: number) {
    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)
    this.region.context.save()
    this.region.context.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )


    if (Settings.rotated === 'south') {
      this.region.context.rotate(Math.PI)
    }
    
    this.drawHPBar()

    this.drawHitsplats()

    this.drawOverheadPrayers()

    this.region.context.restore()

    this.drawIncomingProjectiles(tickPercent)



  }
}
