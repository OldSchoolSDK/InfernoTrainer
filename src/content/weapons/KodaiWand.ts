'use strict'

import BPInventImage from '../../assets/images/equipment/Kodai_wand.png'
import { MeleeWeapon } from '../../sdk/weapons/MeleeWeapon'

export class KodaiWand extends MeleeWeapon {

  constructor() {
    super();

    this.bonuses = {
      attack: {
        stab: -1,
        slash: -1,
        crush: -1,
        magic: 53,
        range: 138
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
        rangedStrength: 62,
        magicDamage: 1.27,
        prayer: 12
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    };
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
