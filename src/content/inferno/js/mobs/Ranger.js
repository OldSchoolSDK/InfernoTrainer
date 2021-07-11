'use strict';

import _ from "lodash";
import Constants from "../../../../sdk/Constants";
import { Mob } from "../../../../sdk/Mob";
import RangeImage from "../../assets/images/ranger.png";
import RangerSound from "../../assets/sounds/ranger.ogg";

export class Ranger extends Mob {

  get cooldown() {
    return 4;
  }

  get attackRange() {
    return 15;
  }

  get maxHealth() {
    return 130;
  }

  get maxHit() {
    return 46;
  }

  get size() {
    return 3;
  }

  get image() {
    return RangeImage;
  }

  get sound() {
    return RangerSound;
  }

  get color() {
    return "#AC88B933";
  }


  attackStyle() {
    return 'range';
  }

  canMeleeIfClose() {
    return true;
  }
  
  playAttackSound (){
    if (Constants.playsAudio){
      setTimeout(() => new Audio(this.sound).play(), 1.75 * Constants.tickMs)
    }
  }

  attackAnimation(stage, framePercent){
    stage.ctx.rotate(Math.sin(-framePercent * Math.PI))
  }
}
