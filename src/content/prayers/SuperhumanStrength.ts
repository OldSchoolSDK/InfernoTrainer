"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class SuperhumanStrength extends BasePrayer {
  get name() {
    return "Superhuman Strength";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.STRENGTH];
  }

  levelRequirement(): number {
    return 13;
  }
  drainRate(): number {
    return 6;
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
