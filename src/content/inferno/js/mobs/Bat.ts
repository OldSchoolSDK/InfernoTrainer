'use strict'

import { Mob } from '../../../../sdk/Mob'
import { RangedWeapon } from '../../../../sdk/Weapons/RangedWeapon'
import BatImage from '../../assets/images/bat.png'
import BatSound from '../../assets/sounds/bat.ogg'
import { MobDeathStore } from '../MobDeathStore'

export class Bat extends Mob {
  get displayName () {
    return 'Jal-MejRah'
  }

  get combatLevel () {
    return 85
  }

  get combatLevelColor () {
    return 'lime'
  }

  dead () {
    super.dead()
    MobDeathStore.npcDied(this)
  }

  setStats () {
    this.frozen = 1

    this.weapons = {
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 55,
      range: 120,
      magic: 120,
      hitpoint: 25,
      prayer: 0,
      run: 0,
      specialAttack: 0
    }

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 25
      },
      defence: {
        stab: 30,
        slash: 30,
        crush: 30,
        magic: -20,
        range: 45
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 30,
        magicDamage: 0,
        prayer: 0
      }
    }
  }

  get cooldown () {
    return 3
  }

  get attackRange () {
    return 4
  }

  get size () {
    return 2
  }

  get image () {
    return BatImage
  }

  get sound () {
    return BatSound
  }

  get color () {
    return '#aadd7333'
  }

  get attackStyle () {
    return 'range'
  }

  attackAnimation (tickPercent: number) {
    this.game.ctx.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2))
  }
}
