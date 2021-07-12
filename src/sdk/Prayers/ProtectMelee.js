'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/meleeOver.png"

import OnSound from "../../assets/sounds/meleeOn.ogg"
import OffSound from "../../assets/sounds/meleeOff.ogg"
import Constants from "../Constants";

export default class ProtectMelee extends BasePrayer{
  
  get name() {
    return 'Protect from Melee';
  }

  get groups(){
    return [BasePrayer.groups.OVERHEADS];
  }
  
  isOverhead() {
    return true;
  }
  
  overheadImageReference(){
    return OverheadImg;
  }
  
  feature () {
    return 'melee';
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
