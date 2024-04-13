"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class UltimateStrength extends BasePrayer {
  get name() {
    return "Ultimate Strength";
  }

  get groups() {
    return [PrayerGroups.STRENGTH];
  }

  levelRequirement(): number {
    return 31;
  }
  drainRate(): number {
    return 12;
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
