import _ from 'lodash'
import { BasePrayer } from '../Prayers/BasePrayer'
import { Unit } from '../Unit'
import { Projectile } from './Projectile'
import { Weapon } from './Weapon'

export class MagicWeapon extends Weapon {
  attack (region, from, to, bonuses = {}, forceSWOnly = false) {
    this._calculatePrayerEffects(from, to, bonuses, forceSWOnly)

    bonuses.isAccurate = bonuses.isAccurate || false
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1

    let damage = this._rollAttack(from, to, bonuses)
    if (this.isBlockable(from, to, bonuses, forceSWOnly)) {
      damage = 0
    }
    this.damage = damage

    if (from.type === Unit.types.PLAYER && damage > 0) {
      from.grantXp(new XpDrop('magic', damage * 4));
      from.grantXp(new XpDrop('hitpoint', damage));
    }

    to.addProjectile(new Projectile(damage, from, to, 'magic', forceSWOnly))
  }

  isBlockable (from, to, bonuses, forceSWOnly) {
    this._calculatePrayerEffects(from, to, bonuses, forceSWOnly)

    if (bonuses.effectivePrayers.overhead && bonuses.effectivePrayers.overhead.feature() === 'magic') {
      return true
    }
    return false
  }

  _calculatePrayerEffects (from, to, bonuses) {
    bonuses.effectivePrayers = {}
    if (from.type !== Unit.types.MOB) {
      const offensiveMagic = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveMagic')
      if (offensiveMagic) {
        bonuses.effectivePrayers.magic = offensiveMagic
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

  _rollAttack (from, to, bonuses) {
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses))
  }

  _magicLevel (from, to, bonuses) {
    let prayerMultiplier = 1
    const magicPrayer = bonuses.effectivePrayers.magic

    if (magicPrayer) {
      if (magicPrayer.name === 'Mystic Will') {
        prayerMultiplier = 1.05
      } else if (magicPrayer.name === 'Mystic Lore') {
        prayerMultiplier = 1.1
      } else if (magicPrayer.name === 'Mystic Might') {
        prayerMultiplier = 1.15
      } else if (magicPrayer.name === 'Augury') {
        prayerMultiplier = 1.2
      }
    }
    return Math.floor(Math.floor(from.currentStats.magic * prayerMultiplier) * bonuses.voidMultiplier + (bonuses.isAccurate ? 2 : 0) + 9)
  }

  _equipmentBonus (from, to, bonuses) {
    return from.bonuses.attack.magic
  }

  _magicDamageBonusMultiplier (from, to, bonuses) {
    return from.bonuses.other.magicDamage
  }

  _attackRoll (from, to, bonuses) {
    return Math.floor(this._magicLevel(from, to, bonuses) * (this._equipmentBonus(from, to, bonuses) + 64) * bonuses.gearMultiplier)
  }

  _defenceRoll (from, to, bonuses) {
    let prayerMultiplier = 1
    const defencePrayer = bonuses.effectivePrayers.defense

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

    return (9 + to.currentStats.magic * prayerMultiplier) * (to.bonuses.defence.magic + 64)
  }

  _hitChance (from, to, bonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses)
    const defenceRoll = this._defenceRoll(from, to, bonuses)
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }

  _maxHit (from, to, bonuses) {
    return Math.floor(this._baseSpellDamage(from, to, bonuses) * (this._magicDamageBonusMultiplier(from, to, bonuses)))
    // TODO: Most of this isn't implemented
    // Spell Base damage +3 if casting bolt spells with chaos gauntlets
    // Answer * (1 + magic damage bonus)
    // Round the answer down to the nearest integer
    // Answer * salve amulet bonus (Salve bonus does not stack with slayer bonus, skip to step 7 if using salve amulet)
    // Round the answer down to the nearest integer
    // Answer * slayer bonus
    // Round the answer down to the nearest integer
    // Answer * Tome of fire bonus
    // Round the answer down to the nearest integer
    // Answer * castle wars bonus
    // Round the answer down to the nearest integer
    // That is the max hit
  }

  _baseSpellDamage (from, to, bonuses) {
    return bonuses.magicBaseSpellDamage // Jal-Zek specific number for now.
  }
}
