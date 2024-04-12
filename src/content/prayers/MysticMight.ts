"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class MysticMight extends BasePrayer {
  get name() {
    return "Mystic Might";
  }

  get groups() {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }

  levelRequirement(): number {
    return 45;
  }
  drainRate(): number {
    return 12;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveMagic";
  }

  playOnSound() {
    if (Settings.playsAudio) {
      // new Audio(OnSound).play();
    }
  }

  playOffSound() {
    if (Settings.playsAudio) {
      // new Audio(OffSound).play();
    }
  }
}
