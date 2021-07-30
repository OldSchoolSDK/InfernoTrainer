'use strict'

import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { Mob } from '../../../../sdk/Mob'
import { Pathing } from '../../../../sdk/Pathing'
import ZukImage from '../../assets/images/TzKal-Zuk.png'
import { InfernoMobDeathStore } from '../InfernoMobDeathStore'
import { UnitBonuses } from '../../../../sdk/Unit'
import { Collision } from '../../../../sdk/Collision'
import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { World } from '../../../../sdk/World'
import { UnitOptions } from '../../../../sdk/Unit'
import { Location } from '../../../../sdk/GameObject'

export class TzKalZuk extends Mob {


  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.attackCooldownTicks = 13;
  }
  
  get displayName () {
    return 'TzKal-Zuk'
  }

  get combatLevel () {
    return 1400
  }

  get combatLevelColor () {
    return 'red'
  }

  canMove() {
    return false;
  }

  magicMaxHit () {
    return 251
  }
  
  setStats () {
    this.stunned = 4

    this.weapons = {
      magic: new MagicWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 350,
      strength: 600,
      defence: 260,
      range: 400,
      magic: 150,
      hitpoint: 1200
    }

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))
  }


  get bonuses(): UnitBonuses{ 
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 550,
        range: 550
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 350,
        range: 100
      },
      other: {
        meleeStrength: 200,
        rangedStrength: 200,
        magicDamage: 4.5,
        prayer: 0
      }
    };
  }
  get cooldown () {
    return 10
  }

  get attackStyle () {
    return 'magic'
  }

  get attackRange () {
    return 1000
  }

  get size () {
    return 7
  }

  get image () {
    return ZukImage
  }

  get sound () {
    return null
  }

  get color () {
    return '#ACFF5633'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0)
  }



}
