"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Smite extends BasePrayer {
  get name() {
    return "Smite";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS];
  }

  levelRequirement(): number {
    return 100;
  }
  drainRate(): number {
    return 18;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "smite";
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
