'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class ProtectRange extends BasePrayer{
  
  get name() {
    return 'Protect from Range';
  }

  get groups(){
    return ['protection'];
  }
  
  isOverhead() {
    return true;
  }
  
  overheadImageReference(){
    return OverheadImg;
  }

  feature () {
    return 'range';
  }

  playOnSound(){
    if (Constants.playsAudio){
      new Audio(OnSound).play();
    }
  }
  
  playOffSound() {
    if (Constants.playsAudio){
      new Audio(OffSound).play();
    }
  }
  
}
