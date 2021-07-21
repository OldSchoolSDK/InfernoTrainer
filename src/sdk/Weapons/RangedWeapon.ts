import { find, intersection } from 'lodash'
import { BasePrayer, PrayerGroups } from '../Prayers/BasePrayer'
import { Region } from '../Region'
import { Unit, UnitTypes } from '../Unit'
import { XpDrop } from '../XpDrop'
import { Projectile } from './Projectile'
import { AttackBonuses, Weapon } from './Weapon'

export class RangedWeapon extends Weapon {
  damage: number;

  attack (region: Region, from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    this._calculatePrayerEffects(from, to, bonuses)
    bonuses.styleBonus = bonuses.styleBonus || 0
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1

    let damage = this._rollAttack(from, to, bonuses)
    if (this.isBlockable(from, to, bonuses)) {
      damage = 0
    }
    this.damage = Math.floor(Math.min(damage, to.currentStats.hitpoint))

    if (from.type === UnitTypes.PLAYER && this.damage > 0) {
      from.grantXp(new XpDrop('hitpoint', this.damage * 1.33));
      from.grantXp(new XpDrop('range', this.damage * 4));
    }

    to.addProjectile(new Projectile(damage, from, to, 'range', false))
  }

  _calculatePrayerEffects (from: Unit, to: Unit, bonuses: AttackBonuses) {
    bonuses.effectivePrayers = {}
    if (from.type !== UnitTypes.MOB) {
      const offensiveRange = find(from.prayers, (prayer: BasePrayer) => prayer.feature() === 'offensiveRange')
      if (offensiveRange) {
        bonuses.effectivePrayers.range = offensiveRange
      }
      const defence = find(from.prayers, (prayer: BasePrayer) => prayer.feature() === 'defence')
      if (defence) {
        bonuses.effectivePrayers.defence = defence
      }
    }
    if (to.type !== UnitTypes.MOB) {
      const overhead = find(to.prayers, (prayer: BasePrayer) => intersection(prayer.groups, [PrayerGroups.OVERHEADS]).length) as BasePrayer
      if (overhead) {
        bonuses.effectivePrayers.overhead = overhead
      }
    }
  }

  isBlockable (from: Unit, to: Unit, bonuses: AttackBonuses) {
    this._calculatePrayerEffects(from, to, bonuses)

    if (bonuses.effectivePrayers.overhead && bonuses.effectivePrayers.overhead.feature() === 'range') {
      return true
    }
    return false
  }

  _rollAttack (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses))
  }

  _hitChance (from: Unit, to: Unit, bonuses: AttackBonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses)
    const defenceRoll = this._defenceRoll(from, to, bonuses)
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }

  _rangedAttack (from: Unit, to: Unit, bonuses: AttackBonuses) {
    let prayerMultiplier = 1
    const rangePrayer = bonuses.effectivePrayers.range

    if (rangePrayer) {
      if (rangePrayer.name === 'Sharp Eye') {
        prayerMultiplier = 1.05
      } else if (rangePrayer.name === 'Hawk Eye') {
        prayerMultiplier = 1.1
      } else if (rangePrayer.name === 'Eagle Eye') {
        prayerMultiplier = 1.15
      } else if (rangePrayer.name === 'Rigour') {
        prayerMultiplier = 1.2
      }
    }

    return Math.floor((Math.floor(from.currentStats.range) * prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier
  }

  _maxHit (from: Unit, to: Unit, bonuses: AttackBonuses) {
    let prayerMultiplier = 1
    const rangePrayer = bonuses.effectivePrayers.range
    if (rangePrayer) {
      if (rangePrayer.name === 'Sharp Eye') {
        prayerMultiplier = 1.05
      } else if (rangePrayer.name === 'Hawk Eye') {
        prayerMultiplier = 1.1
      } else if (rangePrayer.name === 'Eagle Eye') {
        prayerMultiplier = 1.15
      } else if (rangePrayer.name === 'Rigour') {
        prayerMultiplier = 1.23
      }
    }
    const rangedStrength = Math.floor((Math.floor(from.currentStats.range) * prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier
    return Math.floor(Math.floor(0.5 + ((rangedStrength * (from.bonuses.other.rangedStrength + 64) / 640) * bonuses.gearMultiplier)) * this._damageMultiplier(from, to, bonuses))
  }

  _attackRoll (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return Math.floor(Math.floor(this._rangedAttack(from, to, bonuses) * (from.bonuses.attack.range + 64) * bonuses.gearMultiplier) * this._accuracyMultiplier(from, to, bonuses))
  }

  _defenceRoll (from: Unit, to: Unit, bonuses: AttackBonuses) {
    let prayerMultiplier = 1
    const defencePrayer = bonuses.effectivePrayers.defence

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

    return (to.currentStats.defence * prayerMultiplier + 9) * (to.bonuses.defence.range + 64)
  }

  _accuracyMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 1 // Used for tbow passive effect
  }

  _damageMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 1 // Used for tbow passive effect
  }
}
