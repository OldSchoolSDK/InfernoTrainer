'use strict'

import BPInventImage from '../../assets/images/weapons/blowpipe.png'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { ItemNames } from "../../sdk/ItemNames";

export class Blowpipe extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 20 + 35 // simulating dragon darts atm
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

  get itemName(): ItemNames {
    return ItemNames.TOXIC_BLOWPIPE
  }
  
  get isTwoHander(): boolean {
    return true;
  }
  
  hasSpecialAttack(): boolean {
    return true;
  }

  get attackRange () {
    return 5
  }

  get attackSpeed () {
    return 2
  }

  get inventoryImage () {
    return BPInventImage
  }

}
