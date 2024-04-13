"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class ProtectItem extends BasePrayer {
  get name() {
    return "Protect Item";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.PROTECTITEM]; // TODO: Incorrect
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
