'use strict';

import { BasePrayer } from "./BasePrayer";
import OnSound from "../../assets/sounds/rangeOn.ogg"
import OffSound from "../../assets/sounds/rangeOff.ogg"
import { Settings } from "../Settings";

export class Chivalry extends BasePrayer{
  
  get name() {
    return 'Chivalry';
  }

  get groups(){
    return [BasePrayer.groups.ATTACK, BasePrayer.groups.STRENGTH, BasePrayer.groups.DEFENCE];
  }
  
  isOverhead() {
    return false;
  }

  feature () {
    return 'offensiveAttack';
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
