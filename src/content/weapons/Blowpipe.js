'use strict';

import BPInventImage from "../../assets/images/weapons/blowpipe.png"
import RangedWeapon from "../../sdk/RangedWeapon";

export class Blowpipe extends RangedWeapon{
  get attackRange() {
      return 5;
  }

  get attackSpeed() {
    return 2;
  }

  get inventoryImage() {
    return BPInventImage;    
  }
}
