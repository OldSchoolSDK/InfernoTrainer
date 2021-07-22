'use strict'

import { MeleeWeapon } from '../../../../sdk/Weapons/MeleeWeapon'
import { AttackIndicators, Mob } from '../../../../sdk/Mob'

import NibblerImage from '../../assets/images/nib.png'
import NibblerSound from '../../assets/sounds/meleer.ogg'
import { Pathing } from '../../../../sdk/Pathing'
import { LineOfSight } from '../../../../sdk/LineOfSight'
import { Projectile } from '../../../../sdk/Weapons/Projectile'
import { Game } from '../../../../sdk/Game'
import { Unit } from '../../../../sdk/Unit'
import { AttackBonuses, Weapon } from '../../../../sdk/Weapons/Weapon'

class NibblerWeapon extends MeleeWeapon {
  attack (game: Game, from: Unit, to: Unit, bonuses: AttackBonuses) {
    const damage = Math.floor(Math.random() * 5)
    this.damage = damage;
    to.addProjectile(new Projectile(this, this.damage, from, to, 'crush'))
  }
}

export class Nibbler extends Mob {
  weapon: any;

  get displayName () {
    return 'Jal-Nib'
  }

  get combatLevel () {
    return 32
  }

  get combatLevelColor () {
    return 'lime'
  }

  setStats () {
    this.frozen = 1
    this.weapon = {
      attackRange: 1
    }
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

    this.bonuses = {
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

  get color () {
    return '#aadd7333'
  }

  get attackStyle () {
    return 'crush'
  }

  attackAnimation (tickPercent: number) {
    this.game.ctx.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2))
  }

  attackIfPossible () {
    this.attackCooldownTicks--

    if (this.aggro.dying === 0) {
      this.dead() // cheat way for now. pillar should AOE
    }
    const isUnderAggro = Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)
    this.attackFeedback = AttackIndicators.NONE

    const aggroPoint = LineOfSight.closestPointTo(this.location.x, this.location.y, this.aggro)
    if (!isUnderAggro && Pathing.dist(this.location.x, this.location.y, aggroPoint.x, aggroPoint.y) <= this.attackRange && this.attackCooldownTicks <= 0) {
      this.attack()
    }
  }
}
