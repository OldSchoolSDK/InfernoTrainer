"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Augury extends BasePrayer {
  get name() {
    return "Augury";
  }

  get groups() {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH, PrayerGroups.DEFENCE];
  }

  levelRequirement(): number {
    return 77;
  }
  isOverhead() {
    return false;
  }

  feature() {
    return "offensiveMagic";
  }

  drainRate(): number {
    return 24;
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
