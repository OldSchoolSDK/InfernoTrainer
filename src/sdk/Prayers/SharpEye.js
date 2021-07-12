'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class SharpEye extends BasePrayer{
  
  get name() {
    return 'Sharp Eye';
  }

  get groups(){
    return ['offensives'];
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
