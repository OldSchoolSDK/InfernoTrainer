'use strict'

import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { Mob } from '../../../../sdk/Mob'
import { Pathing } from '../../../../sdk/Pathing'
import MeleerImage from '../../assets/images/meleer.png'
import MeleerSound from '../../assets/sounds/meleer.ogg'
import { InfernoMobDeathStore } from '../InfernoMobDeathStore'
import { UnitBonuses } from '../../../../sdk/Unit'
import { Collision } from '../../../../sdk/Collision'

export class JalImKot extends Mob {
  get displayName () {
    return 'Jal-ImKot'
  }

  get combatLevel () {
    return 240
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
      slash: new MeleeWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 210,
      strength: 290,
      defence: 120,
      range: 220,
      magic: 120,
      hitpoint: 75
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
        magic: 0,
        range: 0
      },
      defence: {
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    };
  }
  get cooldown () {
    return 4
  }

  attackStyleForNewAttack () {
    return 'slash'
  }

  get attackRange () {
    return 1
  }

  get size () {
    return 4
  }

  get image () {
    return MeleerImage
  }

  get sound () {
    return MeleerSound
  }

  get color () {
    return '#ACFF5633'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.transform(
      1, 
      0, 
      Math.sin(-tickPercent * Math.PI * 2) / 2, 
      1, 
      0, 
      0
    )
  }

  movementStep () {
    super.movementStep()
    if (!this.hasLOS) {
      if (((this.attackCooldownTicks <= -38) && (Math.random() < 0.1)) || (this.attackCooldownTicks <= -50)) {
        this.dig()
      }
    }
  }

  dig () {
    this.attackCooldownTicks = 8
    if (!Collision.collidesWithAnyEntities(this.world, this.world.player.location.x - 3, this.world.player.location.y + 3, this.size)) {
      this.location.x = this.world.player.location.x - this.size + 1
      this.location.y = this.world.player.location.y + this.size - 1
    } else if (!Collision.collidesWithAnyEntities(this.world, this.world.player.location.x, this.world.player.location.y, this.size)) {
      this.location.x = this.world.player.location.x
      this.location.y = this.world.player.location.y
    } else if (!Collision.collidesWithAnyEntities(this.world, this.world.player.location.x - 3, this.world.player.location.y, this.size)) {
      this.location.x = this.world.player.location.x - this.size + 1
      this.location.y = this.world.player.location.y
    } else if (!Collision.collidesWithAnyEntities(this.world, this.world.player.location.x, this.world.player.location.y + 3, this.size)) {
      this.location.x = this.world.player.location.x
      this.location.y = this.world.player.location.y + this.size - 1
    } else {
      this.location.x = this.world.player.location.x - 1
      this.location.y = this.world.player.location.y + 1
    }
    this.perceivedLocation = this.location
  }
}
