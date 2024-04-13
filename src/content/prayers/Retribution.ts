"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import { Settings } from "../../sdk/Settings";

export class Retribution extends BasePrayer {
  get name() {
    return "Retribution";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS]; // TODO: Incorrect
  }

  levelRequirement(): number {
    return 100;
  }
  drainRate(): number {
    return 3;
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
