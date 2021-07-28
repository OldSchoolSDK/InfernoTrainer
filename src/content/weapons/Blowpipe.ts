'use strict'

import BPInventImage from '../../assets/images/weapons/blowpipe.png'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'

export class Blowpipe extends RangedWeapon {
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
