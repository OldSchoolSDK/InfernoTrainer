'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/mageOver.png"
import OnSound from "../../assets/sounds/mageOn.ogg"
import OffSound from "../../assets/sounds/mageOff.ogg"
import Settings from "../Settings";

export default class ProtectMage extends BasePrayer{
  
  get name() {
    return 'Protect from Magic';
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
    return 'magic';
  }

  playOnSound(){
    if (Settings.playsAudio){
      new Audio(OnSound).play();
    }
  }
  
  playOffSound() {
    if (Settings.playsAudio){
      new Audio(OffSound).play();
    }
  }
}
