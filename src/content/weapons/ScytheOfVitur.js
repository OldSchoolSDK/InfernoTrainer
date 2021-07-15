'use strict';

import ScytheInventImage from "../../assets/images/weapons/scytheOfVitur.png"
import { MeleeWeapon } from "../../sdk/Weapons/MeleeWeapon";

export class ScytheOfVitur extends MeleeWeapon{
  get attackRange() {
      return 1;
  }

  get attackSpeed() {
    return 5;
  }

  get inventoryImage() {
    return ScytheInventImage;    
  }

  get bonuses() {
    return {
      attack: {
        stab: 70,
        slash: 110,
        crush: 30,
        magic: -6,
        range: 0
      },
      defence: {
        stab: -2,
        slash: 8,
        crush: 10,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 75,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}
