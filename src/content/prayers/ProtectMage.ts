"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import OverheadImg from "../../assets/images/prayers/mageOver.png";
import OnSound from "../../assets/sounds/mageOn.ogg";
import OffSound from "../../assets/sounds/mageOff.ogg";
import { Settings } from "../../sdk/Settings";

export class ProtectMage extends BasePrayer {
  get name() {
    return "Protect from Magic";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS];
  }
  levelRequirement(): number {
    return 37;
  }

  drainRate(): number {
    return 12;
  }

  isOverhead() {
    return true;
  }

  overheadImageReference() {
    return OverheadImg;
  }

  feature() {
    return "magic";
  }

  playOnSound() {
    if (Settings.playsAudio) {
      new Audio(OnSound).play();
    }
  }

  playOffSound() {
    if (Settings.playsAudio) {
      new Audio(OffSound).play();
    }
  }
}
