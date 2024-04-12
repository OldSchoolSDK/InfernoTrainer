"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class IncredibleReflexes extends BasePrayer {
  get name() {
    return "Incredible Reflexes";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.ACCURACY];
  }

  levelRequirement(): number {
    return 34;
  }
  drainRate(): number {
    return 12;
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
