'use strict'

import { EntityName } from "../../../../sdk/EntityName"
import { Mob } from '../../../../sdk/Mob'
import { UnitBonuses } from '../../../../sdk/Unit'
import { RangedWeapon } from '../../../../sdk/weapons/RangedWeapon'
import BatImage from '../../assets/images/bat.png'
import BatSound from '../../assets/sounds/bat.ogg'
import { InfernoMobDeathStore } from '../InfernoMobDeathStore'

export class JalMejRah extends Mob {

  mobName(): EntityName { 
    return EntityName.JAL_MEJ_RAJ;
  }
  
  get combatLevel () {
    return 85
  }

  get combatLevelColor () {
    return 'lime'
  }

  dead () {
    super.dead()
    InfernoMobDeathStore.npcDied(this)
  }

  setStats () {
    this.stunned = 1

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
      hitpoint: 25
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
    };
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

  
  attackStyleForNewAttack () {
    return 'range'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.translate(
      Math.sin(tickPercent * Math.PI * 4) * 2, 
      Math.sin(tickPercent * Math.PI * -2))
  }
}
