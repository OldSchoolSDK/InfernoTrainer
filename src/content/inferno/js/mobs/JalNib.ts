'use strict'

import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { AttackIndicators, Mob } from '../../../../sdk/Mob'

import NibblerImage from '../../assets/images/nib.png'
import NibblerSound from '../../assets/sounds/meleer.ogg'
import { Pathing } from '../../../../sdk/Pathing'
import { Projectile, ProjectileOptions } from '../../../../sdk/weapons/Projectile'
import { World } from '../../../../sdk/World'
import { Unit, UnitBonuses, UnitOptions } from '../../../../sdk/Unit'
import { AttackBonuses } from '../../../../sdk/gear/Weapon'
import { Collision } from '../../../../sdk/Collision'
import { Location } from "../../../../sdk/Location"
import { EntityName } from "../../../../sdk/EntityName"
import { Random } from '../../../../sdk/Random'

class NibblerWeapon extends MeleeWeapon {
  attack (world: World, from: Unit, to: Unit, bonuses: AttackBonuses, options: ProjectileOptions = {}): boolean {
    const damage = Math.floor(Random.get() * 5)
    this.damage = damage;
    to.addProjectile(new Projectile(this, this.damage, from, to, 'crush', options))
    return true;
  }
}

export class JalNib extends Mob {

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.autoRetaliate = false;
  }

  mobName(): EntityName { 
    return EntityName.JAL_NIB;
  }

  get combatLevel () {
    return 32
  }

  get combatLevelColor () {
    return 'lime'
  }

  setStats () {
    this.stunned = 1
    this.autoRetaliate = false;
    this.weapons = {
      crush: new NibblerWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 15,
      range: 1,
      magic: 15,
      hitpoint: 10
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
        range: 0
      },
      defence: {
        stab: -20,
        slash: -20,
        crush: -20,
        magic: -20,
        range: -20
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    }
  }

  get consumesSpace (): Unit {
    return null
  }

  get cooldown () {
    return 4
  }

  get attackRange () {
    return 1
  }

  get size () {
    return 1
  }

  get image () {
    return NibblerImage
  }

  get sound () {
    return NibblerSound
  }

  attackStyleForNewAttack () {
    return 'crush'
  }

  attackAnimation (tickPercent: number) {
    this.world.region.context.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2))
  }

  attackIfPossible () {
    this.attackCooldownTicks--
    this.attackStyle = this.attackStyleForNewAttack()

    if (this.dying === -1 && this.aggro.dying > -1) {
      this.dead() // cheat way for now. pillar should AOE
    }
    if (this.canAttack() === false) {
      return;
    }
    const isUnderAggro = Collision.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)
    this.attackFeedback = AttackIndicators.NONE

    const aggroPoint = Pathing.closestPointTo(this.location.x, this.location.y, this.aggro)
    if (!isUnderAggro && Pathing.dist(this.location.x, this.location.y, aggroPoint.x, aggroPoint.y) <= this.attackRange && this.attackCooldownTicks <= 0) {
      this.attack()
    }
  }
}
