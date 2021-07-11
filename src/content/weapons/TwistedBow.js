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
}
