'use strict'

import { Settings } from '../../../../sdk/Settings'
import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { Mob } from '../../../../sdk/Mob'
import { RangedWeapon } from '../../../../sdk/weapons/RangedWeapon'
import RangeImage from '../../assets/images/ranger.png'
import RangerSound from '../../assets/sounds/ranger.ogg'
import { InfernoMobDeathStore } from '../InfernoMobDeathStore'
import { Pathing } from '../../../../sdk/Pathing'
import { Unit, UnitBonuses } from '../../../../sdk/Unit'
import { Projectile } from '../../../../sdk/weapons/Projectile'
import { DelayedAction } from '../../../../sdk/DelayedAction'


class JalXilWeapon extends RangedWeapon { 
  registerProjectile(from: Unit, to: Unit) {
    DelayedAction.registerDelayedAction(new DelayedAction(() => {
      to.addProjectile(new Projectile(this, this.damage, from, to, 'range', { reduceDelay: 2 }))
    }, 2));
  }
}

export class JalXil extends Mob {
  get displayName () {
    return 'Jal-Xil'
  }

  get combatLevel () {
    return 370
  }

  get combatLevelColor () {
    return 'red'
  }

  dead () {
    super.dead()
    InfernoMobDeathStore.npcDied(this)
  }

  setStats () {
    this.stunned = 1

    this.weapons = {
      crush: new MeleeWeapon(),
      range: new JalXilWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 140,
      strength: 180,
      defence: 60,
      range: 250,
      magic: 90,
      hitpoint: 125
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
        magic: 0,
        range: 40
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
        rangedStrength: 50,
        magicDamage: 0,
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
    return 3
  }

  get image () {
    return RangeImage
  }

  get sound () {
    return RangerSound
  }

  attackStyleForNewAttack () {
    return 'range'
  }

  canMeleeIfClose () {
    return 'crush'
  }

  playAttackSound () {
    if (Settings.playsAudio) {
      setTimeout(() => {
        const sound = new Audio(this.sound)
        sound.volume = 1 / Math.min(3, Pathing.dist(this.location.x, this.location.y, this.world.player.location.x, this.world.player.location.y) / 5)
        sound.play()
      }, 1.75 * Settings.tickMs)
    }
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.rotate(Math.sin(-tickPercent * Math.PI))
  }
}
