'use strict'

import BPInventImage from '../../assets/images/equipment/Kodai_wand.png'
import { MeleeWeapon } from '../../sdk/weapons/MeleeWeapon'
import { ItemName } from "../../sdk/ItemName";

export class KodaiWand extends MeleeWeapon {

  constructor() {
    super();

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 28,
        range: 0
      },
      defence: {
        stab: 0,
        slash: 3,
        crush: 3,
        magic: 20,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0.15,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
  
  get weight(): number {
    return 0.198
  }
  
  get itemName(): ItemName {
    return ItemName.KODAI_WAND
  }
  
  get isTwoHander(): boolean {
    return false;
  }
  
  hasSpecialAttack(): boolean {
    return false;
  }

  get attackRange () {
    // TODO: Override with spell selection
    return 1
  }

  get attackSpeed () {
    return 4
  }

  get inventoryImage () {
    return BPInventImage
  }

}
