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


  _maxHit(from, to, bonuses) {
    const rangedStrength = Math.floor((Math.floor(from.currentStats.range) * bonuses.prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
    return Math.floor(Math.floor(0.5 + ((rangedStrength * (from.bonuses.other.rangedStrength + 64) / 640) * bonuses.gearMultiplier)) * this._damageMultiplier(from, to, bonuses));
  }

  _attackRoll(from, to, bonuses){
    return Math.floor(Math.floor(this._rangedAttack(from, to, bonuses) * (from.bonuses.attack.range + 64) * bonuses.gearMultiplier) * this._accuracyMultiplier(from, to, bonuses));
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
