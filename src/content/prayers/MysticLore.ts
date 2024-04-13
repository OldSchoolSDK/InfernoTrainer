"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class MysticLore extends BasePrayer {
  get name() {
    return "Mystic Lore";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.ACCURACY, PrayerGroups.STRENGTH];
  }
  levelRequirement(): number {
    return 27;
  }

  drainRate(): number {
    return 6;
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
