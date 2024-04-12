"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class MysticWill extends BasePrayer {
  get name() {
    return "Mystic Will";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }
  levelRequirement(): number {
    return 9;
  }
  drainRate(): number {
    return 3;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveMagic";
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
