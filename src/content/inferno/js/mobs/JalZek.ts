'use strict'

import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { Mob, AttackIndicators } from '../../../../sdk/Mob'
import MagerImage from '../../assets/images/mager.png'
import MagerSound from '../../assets/sounds/mager.ogg'
import { Pathing } from '../../../../sdk/Pathing'
import { InfernoMobDeathStore } from '../InfernoMobDeathStore'
import { Unit, UnitBonuses } from '../../../../sdk/Unit'
import { Collision } from '../../../../sdk/Collision'
import { TzKalZuk } from './TzKalZuk'
import { EntityName } from "../../../../sdk/EntityName"
import { find } from 'lodash'

export class JalZek extends Mob {
  isZukWave: boolean;

  
  mobName(): EntityName { 
    return EntityName.JAL_ZEK;
  }

  get combatLevel () {
    return 490
  }

  get combatLevelColor () {
    return 'red'
  }

  dead () {
    super.dead()
    InfernoMobDeathStore.npcDied(this)
  }

  setStats () {

    // Scan for a zuk
    const zuk = find(this.world.mobs, (mob: Unit) => {
      return mob.mobName() === EntityName.TZ_KAL_ZUK;
    }) as TzKalZuk;
    this.isZukWave = zuk !== null

    this.stunned = 1

    this.weapons = {
      stab: new MeleeWeapon(),
      magic: new MagicWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 370,
      strength: 510,
      defence: 260,
      range: 510,
      magic: 300,
      hitpoint: 220
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
        magic: 80,
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
        magicDamage: 1.0,
        prayer: 0
      }
    };
  }

  get cooldown () {
    return 4
  }

  get attackRange () {
    return 15
  }

  get size () {
    return 4
  }

  get image () {
    return MagerImage
  }

  get sound () {
    return MagerSound
  }
  attackStyleForNewAttack () {
    return 'magic'
  }

  canMeleeIfClose () {
    return 'stab'
  }

  magicMaxHit () {
    return 70
  }

  get maxHit () {
    return 70
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.rotate(tickPercent * Math.PI * 2)
  }

  respawnLocation (mobToResurrect: Mob) {
    for (let x = 15; x < 21; x++) {
      for (let y = 10; y < 22; y++) {
        if (!Collision.collidesWithAnyMobs(this.world, x, y, mobToResurrect.size)) {
          if (!Collision.collidesWithAnyEntities(this.world, x, y, mobToResurrect.size)) {
            return { x, y }
          }
        }
      }
    }

    return { x: 21, y: 22 }
  }

  attackIfPossible () {
    this.attackCooldownTicks--
    
    this.attackStyle = this.attackStyleForNewAttack()

    this.attackFeedback = AttackIndicators.NONE

    this.hadLOS = this.hasLOS
    this.setHasLOS()


    if (this.canAttack() === false) {
      return;
    }
    
    const isUnderAggro = Collision.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)

    if (!isUnderAggro && this.hasLOS && this.attackCooldownTicks <= 0) {
      if (Math.random() < 0.1 && !this.isZukWave) {
        const mobToResurrect = InfernoMobDeathStore.selectMobToResurect()
        if (!mobToResurrect) {
          this.attack()
        } else {
          // Set to 50% health
          mobToResurrect.currentStats.hitpoint = Math.floor(mobToResurrect.stats.hitpoint / 2)
          mobToResurrect.dying = -1
          mobToResurrect.attackCooldownTicks = mobToResurrect.cooldown;

          mobToResurrect.setLocation(this.respawnLocation(mobToResurrect))

          mobToResurrect.perceivedLocation = mobToResurrect.location
          this.world.addMob(mobToResurrect)
          // (15, 10) to  (21 , 22)
          this.attackCooldownTicks = this.cooldown
        }
      } else {
        this.attack()
      }
    }
  }
}
