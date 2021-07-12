'use strict';

import BasePrayer from "./BasePrayer";
import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class Piety extends BasePrayer{
  
  get name() {
    return 'Piety';
  }

  get groups(){
    return [BasePrayer.groups.ATTACK, BasePrayer.groups.STRENGTH, BasePrayer.groups.DEFENCE];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return 'offensiveAttack';
  }

  playOnSound(){
    if (Constants.playsAudio){
      // new Audio(OnSound).play();
    }
  }
  
  playOffSound() {
    if (Constants.playsAudio){
      // new Audio(OffSound).play();
    }
  }
  
}
