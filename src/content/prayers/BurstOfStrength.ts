"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class BurstOfStrength extends BasePrayer {
  get name() {
    return "Burst of Strength";
  }

  get groups() {
    return [PrayerGroups.STRENGTH];
  }
  levelRequirement(): number {
    return 4;
  }

  drainRate(): number {
    return 3;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveStrength";
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
