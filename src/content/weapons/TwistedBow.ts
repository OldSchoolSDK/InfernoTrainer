'use strict'

import TbowInventImage from '../../assets/images/weapons/twistedBow.png'
import { Unit, UnitBonuses } from '../../sdk/Unit'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { ItemName } from "../../sdk/ItemName"

export class TwistedBow extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 70
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 20 + 60, // simulating dragon arrows
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }


  get itemName(): ItemName {
    return ItemName.TWISTED_BOW
  }

  get isTwoHander(): boolean {
    return true;
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
    const magic = Math.min(Math.max(to.currentStats.magic, to.bonuses.attack.magic), 250)
    const multiplier = (140 + ((10 * 3 * magic / 10 - 10) / 100) - (Math.pow(3 * magic / 10 - 100, 2) / 100)) / 100
    return Math.min(1.40, Math.max(0, multiplier))
  }

  _damageMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    const magic = Math.min(Math.max(to.currentStats.magic, to.bonuses.attack.magic), 250)
    const multiplier = (250 + ((10 * 3 * magic / 10 - 14) / 100) - (Math.pow(3 * magic / 10 - 140, 2) / 100)) / 100
    return Math.min(2.50, Math.max(0, multiplier))
  }
}
