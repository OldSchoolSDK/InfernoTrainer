"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class HawkEye extends BasePrayer {
  get name() {
    return "Hawk Eye";
  }

  get groups() {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }

  levelRequirement(): number {
    return 26;
  }
  drainRate(): number {
    return 6;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveRange";
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
