'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class HawkEye extends BasePrayer{
  
  get name() {
    return 'Hawk Eye';
  }

  get groups(){
    return [BasePrayer.groups.RANGE];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return [BasePrayer.groups.RANGE];
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
