'use strict';

import { Weapon } from "../../sdk/Weapon";
import TbowInventImage from "../../assets/images/weapons/twistedBow.png"
import RangedWeapon from "../../sdk/RangedWeapon";

export class TwistedBow extends RangedWeapon{

  get attackRange() {
      return 10;
  }

  get attackSpeed() {
    return 5;
  }

  get inventoryImage() {
    return TbowInventImage;    
  }

  get bonuses() {
    return {
      attack: {
        stab: -1,
        slash: -1,
        crush: -1,
        magic: -28,
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
        magicDamage: 0,
        prayer: 12
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }


  _accuracyMultiplier(from, to, bonuses) {
    const magic = Math.max(to.currentStats.magic, to.bonuses.attack.magic);
    const multiplier = (140 + ((10 * 3 * magic / 10 - 10) / 100) - (Math.pow(3 * magic / 10 - 100) / 100, 2) ) / 100;
    return Math.min(1.40, Math.max(0, multiplier));
  }

  _damageMultiplier(from, to, bonuses) {
    const magic = Math.max(to.currentStats.magic, to.bonuses.attack.magic);
    const multiplier = (250 + ((10 * 3 * magic / 10 - 14) / 100) - (Math.pow(3 * magic / 10 - 140) / 100, 2) ) / 100;
    return Math.min(2.50, Math.max(0, multiplier));  
  }
}
