'use strict'

import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { AttackIndicators, Mob } from '../../../../sdk/Mob'
import { RangedWeapon } from '../../../../sdk/weapons/RangedWeapon'
import JadImage from '../../assets/images/JalTok-Jad.png'
import { UnitBonuses, UnitOptions } from '../../../../sdk/Unit'
import { World } from '../../../../sdk/World'
import { Location } from '../../../../sdk/GameObject'


interface JadUnitOptions extends UnitOptions {
  attackSpeed: number;
  stun: number;
}

export class JalTokJad extends Mob {
  playerPrayerScan?: string = null;
  waveCooldown: number;

  constructor (world: World, location: Location, options: JadUnitOptions) {
    super(world, location, options)
    this.waveCooldown = options.attackSpeed;
    this.stunned = options.stun;
  }

  get displayName () {
    return 'JalTok-Jad'
  }

  get combatLevel () {
    return 900
  }

  get combatLevelColor () {
    return 'red'
  }
  setStats () {

    this.weapons = {
      stab: new MeleeWeapon(),
      magic: new MagicWeapon(),
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      hitpoint: 350,
      attack: 750,
      strength: 1020,
      defence: 480,
      range: 1020,
      magic: 510
    }

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 100,
        range: 80
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
        rangedStrength: 80,
        magicDamage: 1.75,
        prayer: 0
      }
    };
  }
  
  get cooldown () {
    return this.waveCooldown
  }

  get attackRange () {
    return 15
  }

  get size () {
    return 5
  }

  get image () {
    return JadImage
  }

  get sound () {
    return null
  }

  attackStyleForNewAttack () {
    return Math.random() < 0.5 ? 'range' : 'magic'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.scale(1 + Math.sin(tickPercent * Math.PI) / 4, 1 - Math.sin(tickPercent * Math.PI) / 4)
  }

  shouldShowAttackAnimation () {
    return this.attackCooldownTicks === this.cooldown && this.playerPrayerScan === null
  }

  canMeleeIfClose () {
    return 'stab'
  }

  canMove() {
    return false;
  }

  magicMaxHit () {
    return 113
  }

  // attackIfPossible () {
  //   this.attackCooldownTicks--
  //   this.attackFeedback = AttackIndicators.NONE

  //   this.hadLOS = this.hasLOS
  //   this.setHasLOS()

  //   if (this.canAttack() === false) {
  //     return;
  //   }
    
  //   // Scan when appropriate
  //   if (this.hasLOS && (!this.hadLOS || (!this.playerPrayerScan && this.attackCooldownTicks <= 0))) {
  //     // we JUST gained LoS, or we are properly queued up for the next scan
  //     const overhead = find(this.world.player.prayers, (prayer: BasePrayer) => prayer.isOverhead() && prayer.isActive)
  //     this.playerPrayerScan = overhead ? overhead.feature() : 'none'
  //     this.attackFeedback = AttackIndicators.SCAN
      
  //     this.attackCooldownTicks = this.cooldown
  //     return
  //   }

    // Perform attack. Blobs can hit through LoS if they got a scan.
  //   if (this.playerPrayerScan && this.attackCooldownTicks <= 0) {
  //     this.attack()
  //     this.attackCooldownTicks = this.cooldown
  //     this.playerPrayerScan = null
  //   }
  // }

  removedFromWorld () {
  }
}
