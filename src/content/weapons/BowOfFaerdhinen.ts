'use strict'

import InventImage from '../../assets/images/equipment/Bow_of_faerdhinen.png'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { ItemName } from "../../sdk/ItemName"
import { Unit } from '../../sdk/Unit'

export class BowOfFaerdhinen extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 128
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
        rangedStrength: 106, // TODO: This will stack with dragon arrows if both equipped 
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
    return ItemName.BOWFA
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
    return InventImage
  }

  _accuracyMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.other.crystalAccuracy || 1;
  }

  _damageMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.other.crystalDamage || 1;
  }
}
