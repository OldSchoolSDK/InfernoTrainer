"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Preserve extends BasePrayer {
  get name() {
    return "Preserve";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.PRESERVE]; // TODO: Incorrect
  }

  levelRequirement(): number {
    return 100;
  }
  drainRate(): number {
    return 2;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "preserve";
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
