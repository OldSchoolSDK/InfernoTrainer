'use strict';

import BasePrayer from "./BasePrayer";
import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import Constants from "../Constants";

export default class ClarityOfThought extends BasePrayer{
  
  get name() {
    return 'Clarity of Thought';
  }

  get groups(){
    return [BasePrayer.groups.ATTACK];
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
