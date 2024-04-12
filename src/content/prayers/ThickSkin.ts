"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class ThickSkin extends BasePrayer {
  get name() {
    return "Thick Skin";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.DEFENCE];
  }

  levelRequirement(): number {
    return 1;
  }
  drainRate(): number {
    return 3;
  }

  isOverhead() {
    return false;
  }

  feature() {
    return "defensive";
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
