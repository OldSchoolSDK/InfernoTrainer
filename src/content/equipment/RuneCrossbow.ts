'use strict'

import InventImage from '../../assets/images/equipment/Rune_crossbow.png'
import { Unit, UnitBonuses } from '../../sdk/Unit'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { ItemName } from "../../sdk/ItemName"

export class RuneCrossbow extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 90
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
        rangedStrength: 20,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }

  get weight(): number {
    return 6;
  }
  

  get itemName(): ItemName {
    return ItemName.RUNE_CROSSBOW
  }

  get isTwoHander(): boolean {
    return false;
  }

  get attackRange () {
    return 9
  }

  get attackSpeed () {
    return 5
  }

  get inventoryImage () {
    return InventImage
  }
}
