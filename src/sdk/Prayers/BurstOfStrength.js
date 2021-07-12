'use strict';

import BasePrayer from "./BasePrayer";
import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class BurstOfStrength extends BasePrayer{
  
  get name() {
    return 'Burst of Strength';
  }

  get groups(){
    return [BasePrayer.groups.STRENGTH];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return 'offensiveStrength';
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
