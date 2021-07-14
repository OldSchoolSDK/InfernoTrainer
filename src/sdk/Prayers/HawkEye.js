'use strict';

import { BasePrayer } from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import { Settings } from "../Settings";

export class HawkEye extends BasePrayer{
  
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
    if (Settings.playsAudio){
      // new Audio(OnSound).play();
    }
  }
  
  playOffSound() {
    if (Settings.playsAudio){
      // new Audio(OffSound).play();
    }
  }
  
}
