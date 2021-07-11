'use strict';

import { Weapon } from "../../sdk/Weapon";
import BPInventImage from "../../assets/images/weapons/blowpipe.png"

export class Blowpipe extends Weapon{
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
