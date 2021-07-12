'use strict';

import BasePrayer from "./BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png"

import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class MysticLore extends BasePrayer{
  
  get name() {
    return 'Mystic Lore';
  }

  get groups(){
    return [BasePrayer.groups.MAGIC, BasePrayer.groups.DEFENCE];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return 'offensiveMagic';
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
