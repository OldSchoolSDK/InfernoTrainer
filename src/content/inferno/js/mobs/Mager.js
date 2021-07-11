'use strict';

import Constants from "../../../../sdk/Constants";
import { Mob } from "../../../../sdk/Mob";
import MagerImage from "../../assets/images/mager.png";
import MagerSound from "../../assets/sounds/mager.ogg";

export class Mager extends Mob{

  get cooldown() {
    return 4;
  }

  get attackRange() {
    return 15;
  }

  get maxHealth() {
    return 220;
  }

  get maxHit() {
    return 70;
  }
  
  get size() {
    return 4;
  }

  get image() {
    return MagerImage;
  }

  get sound() {
    return MagerSound;
  }
  
  get color() {
    return "#ffffff33";
  }

  attackStyle() {
    return 'mage';
  }
  
  canMeleeIfClose() {
    return true;
  }

  attackAnimation(stage, framePercent){
    stage.ctx.rotate(framePercent * Math.PI * 2);
  }
}
