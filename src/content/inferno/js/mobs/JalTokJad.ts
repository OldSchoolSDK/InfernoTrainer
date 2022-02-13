'use strict'

import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { AttackIndicators, Mob } from '../../../../sdk/Mob'
import { RangedWeapon } from '../../../../sdk/weapons/RangedWeapon'
import JadImage from '../../assets/images/JalTok-Jad.png'
import { Unit, UnitBonuses, UnitOptions } from '../../../../sdk/Unit'
import { World } from '../../../../sdk/World'
import { Location } from "../../../../sdk/Location"
import { AttackBonuses } from '../../../../sdk/gear/Weapon'
import { Projectile, ProjectileOptions } from '../../../../sdk/weapons/Projectile'
import { DelayedAction } from '../../../../sdk/DelayedAction'
import { YtHurKot } from './YtHurKot';
import { Collision } from '../../../../sdk/Collision'
import { EntityName } from "../../../../sdk/EntityName"

import MagicSound from '../../assets/sounds/TzTok-Jad-Magic-attack.ogg'
import RangeSound from '../../assets/sounds/TzTok-Jad-Ranged-attack.ogg'


interface JadUnitOptions extends UnitOptions {
  attackSpeed: number;
  stun: number;
  healers: number;
  isZukWave: boolean;
}

class JadMagicWeapon extends MagicWeapon {

  attack (world: World, from: Mob, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    DelayedAction.registerDelayedAction(new DelayedAction(() => {

      const overhead = world.player.prayerController.matchFeature('magic')
      from.attackFeedback = AttackIndicators.HIT
      if (overhead){
        from.attackFeedback = AttackIndicators.BLOCKED
      }

      super.attack(world, from, to, bonuses);
    }, 3));
  }
  
  registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses, options: ProjectileOptions = {}) {
    to.addProjectile(new Projectile(this, this.damage, from, to, 'magic', { reduceDelay: 2 }))
  }
}
class JadRangeWeapon extends RangedWeapon {

  attack (world: World, from: Mob, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    DelayedAction.registerDelayedAction(new DelayedAction(() => {

      const overhead = world.player.prayerController.matchFeature('range')
      from.attackFeedback = AttackIndicators.HIT
      if (overhead){
        from.attackFeedback = AttackIndicators.BLOCKED
      }
      
      super.attack(world, from, to, bonuses);
    }, 2));
  }
  registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses, options: ProjectileOptions = {}) {
    to.addProjectile(new Projectile(this, this.damage, from, to, 'range', { reduceDelay: 2 }))
  }
}

export class JalTokJad extends Mob {
  playerPrayerScan?: string = null;
  waveCooldown: number;
  hasProccedHealers: boolean = false;
  healers: number;
  isZukWave: boolean;

  constructor (world: World, location: Location, options: JadUnitOptions) {
    super(world, location, options)
    this.waveCooldown = options.attackSpeed;
    this.stunned = options.stun;
    this.healers = options.healers;
    this.autoRetaliate = true;
    this.isZukWave = options.isZukWave;
  }


  mobName(): EntityName { 
    return EntityName.JAL_TOK_JAD;
  }
  
  get combatLevel () {
    return 900
  }

  get combatLevelColor () {
    return 'red'
  }
  
  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate
  }
  
  setStats () {

    this.weapons = {
      stab: new MeleeWeapon(),
      magic: new JadMagicWeapon(),
      range: new JadRangeWeapon()
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

  damageTaken() {
    if (this.currentStats.hitpoint < this.stats.hitpoint / 2) {
      if (this.hasProccedHealers === false){
        this.autoRetaliate = false;
        this.hasProccedHealers = true;
        for (let i=0; i < this.healers; i++) {
          // Spawn healer

          let xOff = 0;
          let yOff = 0;

          while (Collision.collidesWithMob(this.world, this.location.x + xOff, this.location.y + yOff, 1, this)){
            if (this.isZukWave) {
              xOff = Math.floor(Math.random() * 6);
              yOff = -Math.floor(Math.random() * 4) - this.size;
            }else{
              xOff = Math.floor(Math.random() * 11) - 5;
              yOff = Math.floor(Math.random() * 15) - 5 - this.size;
            }
          }

          const healer = new YtHurKot(this.world, { x: this.location.x + xOff, y: this.location.y + yOff }, { aggro: this });
          this.world.region.addMob(healer)

        }
      }  
    }
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
  
  get flinchDelay () {
    return 2;
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
    return this.attackStyle === 'magic' ? MagicSound : RangeSound;
  }

  attackStyleForNewAttack () {
    return Math.random() < 0.5 ? 'range' : 'magic'
  }

  attackAnimation (tickPercent: number) {
    if (this.attackStyle === 'magic') {
      this.world.region.context.rotate(tickPercent * Math.PI * 2)
    }else{
      this.world.region.context.rotate(Math.sin(-tickPercent * Math.PI))
    }
  }

  shouldShowAttackAnimation () {
    return this.attackCooldownTicks === this.cooldown && this.playerPrayerScan === null
  }

  canMeleeIfClose () {
    return 'stab'
  }

  magicMaxHit () {
    return 113
  }

  attack () {
    super.attack();
    this.attackFeedback = AttackIndicators.NONE
  }

  removedFromWorld () {
  }
}
