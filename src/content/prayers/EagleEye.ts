"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class EagleEye extends BasePrayer {
  get name() {
    return "Eagle Eye";
  }

  get groups() {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }
  levelRequirement(): number {
    return 44;
  }

  drainRate(): number {
    return 12;
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
