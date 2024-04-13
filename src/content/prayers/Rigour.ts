"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Rigour extends BasePrayer {
  get name() {
    return "Rigour";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH, PrayerGroups.DEFENCE];
  }

  levelRequirement(): number {
    return 74;
  }
  drainRate(): number {
    return 24;
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
