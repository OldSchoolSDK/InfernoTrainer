"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class SharpEye extends BasePrayer {
  get name() {
    return "Sharp Eye";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }

  levelRequirement(): number {
    return 8;
  }
  drainRate(): number {
    return 3;
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
