"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Chivalry extends BasePrayer {
  get name() {
    return "Chivalry";
  }

  get groups() {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH, PrayerGroups.DEFENCE];
  }

  levelRequirement(): number {
    return 60;
  }
  drainRate(): number {
    return 24;
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
