"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class SteelSkin extends BasePrayer {
  get name() {
    return "Steel Skin";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.DEFENCE];
  }

  levelRequirement(): number {
    return 28;
  }
  drainRate(): number {
    return 12;
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
