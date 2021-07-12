'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class EagleEye extends BasePrayer{
  
  get name() {
    return 'Eagle Eye';
  }

  get groups(){
    return [BasePrayer.groups.RANGE];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return 'offensiveRange';
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
