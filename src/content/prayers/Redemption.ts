"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";
import OverheadImg from "../../assets/images/prayers/redemptionOver.png";
import OnSound from "../../assets/sounds/redemption_2680.ogg"

export class Redemption extends BasePrayer {
  get name() {
    return "Redemption";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS];
  }

  levelRequirement(): number {
    return 49;
  }
  drainRate(): number {
    return 6;
  }

  isOverhead() {
    return true;
  }

  overheadImageReference() {
    return OverheadImg;
  }
  feature() {
    return "redemption";
  }

  playOnSound() {
    if (Settings.playsAudio) {
      new Audio(OnSound).play();
    }
  }

  playOffSound() {
    if (Settings.playsAudio) {
      // new Audio(OffSound).play();
    }
  }
}
