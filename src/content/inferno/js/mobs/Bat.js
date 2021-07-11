'use strict';

import Constants from "../../../../sdk/Constants";
import { Mob } from "../../../../sdk/Mob";
import BatImage from "../../assets/images/bat.png";
import BatSound from "../../assets/sounds/bat.ogg";

export class Bat extends Mob{

  get cooldown() {
    return 3;
  }

  get attackRange() {
    return 4;
  }

  get maxHealth() {
    return 25;
  }

  get maxHit() {
    return 19;
  }

  get size() {
    return 2;
  }

  get image() {
    return BatImage;
  }

  get sound() {
    return BatSound;
  }
  
  get color() {
    return "#aadd7333";
  }

  attackStyle() {
    return 'range';
  }
  
  attackAnimation(stage, framePercent){
    stage.ctx.translate(Math.sin(framePercent * Math.PI * 4) * 2, Math.sin(framePercent * Math.PI * -2))
  }
}
