"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class RapidHeal extends BasePrayer {
  get name() {
    return "Rapid Heal";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.HEARTS];
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
    return "";
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
