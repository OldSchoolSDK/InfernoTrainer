"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class ImprovedReflexes extends BasePrayer {
  get name() {
    return "Improved Reflexes";
  }

  get groups() {
    return [PrayerGroups.ACCURACY];
  }

  levelRequirement(): number {
    return 16;
  }
  drainRate(): number {
    return 6;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveAttack";
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
