'use strict'

import TbowInventImage from '../../assets/images/weapons/twistedBow.png'
import { Unit, UnitBonuses } from '../../sdk/Unit'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { AttackBonuses } from '../../sdk/weapons/Weapon'

export class TwistedBow extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: -1,
        slash: -1,
        crush: -1,
        magic: 53,
        range: 168
      },
      defence: {
        stab: 213,
        slash: 202,
        crush: 219,
        magic: 135,
        range: 215
      },
      other: {
        meleeStrength: 15,
        rangedStrength: 87,
        magicDamage: 1.27,
        prayer: 12
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
  get attackRange () {
    return 10
  }

  get attackSpeed () {
    return 5
  }

  get inventoryImage () {
    return TbowInventImage
  }

  _accuracyMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    const magic = Math.max(to.currentStats.magic, to.bonuses.attack.magic)
    const multiplier = 140 + ((10 * 3 * magic / 10 - 10) / 100) - (Math.pow(3 * magic / 10 - 100, 2) / 100) / 100
    return Math.min(1.40, Math.max(0, multiplier))
  }

  _damageMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    const magic = Math.max(to.currentStats.magic, to.bonuses.attack.magic)
    const multiplier = 250 + ((10 * 3 * magic / 10 - 14) / 100) - (Math.pow(3 * magic / 10 - 140, 2) / 100) / 100
    return Math.min(2.50, Math.max(0, multiplier))
  }
}
