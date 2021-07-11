'use strict';

import { Weapon } from "../../sdk/Weapon";
import TbowInventImage from "../../assets/images/weapons/twistedBow.png"
export class TwistedBow extends Weapon{

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
