import _ from 'lodash'
import { Projectile } from './Projectile'
import { Weapon } from './Weapon'
import { BasePrayer } from '../Prayers/BasePrayer'
import { Unit } from '../Unit'
import { XpDrop } from '../XpDrop'

export class MeleeWeapon extends Weapon {
  attack (region, from, to, bonuses = {}) {
    this._calculatePrayerEffects(from, to, bonuses)

    bonuses.attackStyle = bonuses.attackStyle || 'slash'
    bonuses.styleBonus = bonuses.styleBonus || 0
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1
    bonuses.overallMultiplier = bonuses.overallMultiplier || 1.0

    let damage = this._rollAttack(from, to, bonuses)

    if (this.isBlockable(from, to, bonuses)) {
      damage = 0
    }

    this.damage = Math.floor(Math.min(damage, to.currentStats.hitpoint))
    
    if (from.type === Unit.types.PLAYER && damage > 0) {
      from.grantXp(new XpDrop('hitpoint', damage * 1.33));
      from.grantXp(new XpDrop('attack', damage * 4));
    }

    to.addProjectile(new Projectile(damage, from, to, bonuses.attackStyle))
  }

  _calculatePrayerEffects (from, to, bonuses) {
    bonuses.effectivePrayers = {}
    if (from.type !== Unit.types.MOB) {
      const offensiveAttack = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveAttack')
      if (offensiveAttack) {
        bonuses.effectivePrayers.attack = offensiveAttack
      }

      const offensiveStrength = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveStrength')
      if (offensiveStrength) {
        bonuses.effectivePrayers.strength = offensiveStrength
      }

      const defence = _.find(from.prayers, (prayer) => prayer.feature() === 'defence')
      if (defence) {
        bonuses.effectivePrayers.defence = defence
      }
    }

    if (to.type !== Unit.types.MOB) {
      const overhead = _.find(to.prayers, (prayer) => _.intersection(prayer.groups, [BasePrayer.groups.OVERHEADS]).length)
      if (overhead) {
        bonuses.effectivePrayers.overhead = overhead
      }
    }
  }

  isBlockable (from, to, bonuses) {
    this._calculatePrayerEffects(from, to, bonuses)

    let prayerAttackBlockStyle = bonuses.attackStyle
    if (Weapon.isMeleeAttackStyle(prayerAttackBlockStyle)) {
      prayerAttackBlockStyle = 'melee' // because protect melee scans for the style as melee, generalize them
    }

    if (bonuses.effectivePrayers.overhead && bonuses.effectivePrayers.overhead.feature() === prayerAttackBlockStyle) {
      return true
    }
    return false
  }

  _rollAttack (from, to, bonuses) {
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses))
  }

  _strengthLevel (from, to, bonuses) {
    let prayerMultiplier = 1
    const strengthPrayer = bonuses.effectivePrayers.strength

    if (strengthPrayer) {
      if (strengthPrayer.name === 'Burst of Strength') {
        prayerMultiplier = 1.05
      } else if (strengthPrayer.name === 'Superhuman Strength') {
        prayerMultiplier = 1.1
      } else if (strengthPrayer.name === 'Ultimate Strength') {
        prayerMultiplier = 1.15
      } else if (strengthPrayer.name === 'Chivalry') {
        prayerMultiplier = 1.18
      } else if (strengthPrayer.name === 'Piety') {
        prayerMultiplier = 1.23
      }
    }
    return Math.floor((Math.floor(from.currentStats.strength * prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier)
  }

  _maxHit (from, to, bonuses) {
    return Math.floor(
      Math.floor(
        (this._strengthLevel(from, to, bonuses) * (from.bonuses.other.meleeStrength + 64) + 320) / 640
      ) * bonuses.gearMultiplier * bonuses.overallMultiplier
    )
  }

  _attackLevel (from, to, bonuses) {
    const attackPrayer = bonuses.effectivePrayers.attack
    let prayerMultiplier = 1
    if (attackPrayer) {
      if (attackPrayer.name === 'Clarity of Thought') {
        prayerMultiplier = 1.05
      } else if (attackPrayer.name === 'Improved Reflexes') {
        prayerMultiplier = 1.1
      } else if (attackPrayer.name === 'Incredible Reflexes') {
        prayerMultiplier = 1.15
      } else if (attackPrayer.name === 'Chivalry') {
        prayerMultiplier = 1.15
      } else if (attackPrayer.name === 'Piety') {
        prayerMultiplier = 1.2
      }
    }

    return Math.floor((Math.floor(from.currentStats.attack * prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier)
  }

  _attackRoll (from, to, bonuses) {
    return Math.floor((this._attackLevel(from, to, bonuses) * (from.bonuses.attack[bonuses.attackStyle] + 64)) * bonuses.gearMultiplier)
  }

  _defenceRoll (from, to, bonuses) {
    if (to.type === Unit.types.MOB || to.type === Unit.types.ENTITY) {
      return (to.currentStats.defence + 9) * (to.bonuses.defence[bonuses.attackStyle] + 64)
    } else {
      return this._defenceLevel(from, to, bonuses) * (to.bonuses.defence[bonuses.attackStyle] + 64)
    }
  }

  _defenceLevel (from, to, bonuses) {
    const defencePrayer = bonuses.effectivePrayers.defence
    let prayerMultiplier = 1
    if (defencePrayer) {
      if (defencePrayer.name === 'Thick Skin') {
        prayerMultiplier = 1.05
      } else if (defencePrayer.name === 'Mystic Will') {
        prayerMultiplier = 1.05
      } else if (defencePrayer.name === 'Rock Skin') {
        prayerMultiplier = 1.1
      } else if (defencePrayer.name === 'Mystic Lore') {
        prayerMultiplier = 1.1
      } else if (defencePrayer.name === 'Steel Skin') {
        prayerMultiplier = 1.15
      } else if (defencePrayer.name === 'Mystic Might') {
        prayerMultiplier = 1.15
      } else if (defencePrayer.name === 'Chivalry') {
        prayerMultiplier = 1.2
      } else if (defencePrayer.name === 'Piety') {
        prayerMultiplier = 1.25
      } else if (defencePrayer.name === 'Rigour') {
        prayerMultiplier = 1.25
      } else if (defencePrayer.name === 'Augury') {
        prayerMultiplier = 1.25
      }
    }
    return (Math.floor(from.currentStats.defence * prayerMultiplier) + bonuses.styleBonus + 8)
  }

  _hitChance (from, to, bonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses)
    const defenceRoll = this._defenceRoll(from, to, bonuses)
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }

  isMeleeAttack () {
    return true
  }
}
