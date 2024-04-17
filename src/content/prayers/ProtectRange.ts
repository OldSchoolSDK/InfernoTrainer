"use strict";

import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
import OverheadImg from "../../assets/images/prayers/rangeOver.png";

import OnSound from "../../assets/sounds/rangeOn.ogg";
import OffSound from "../../assets/sounds/rangeOff.ogg";
import { Settings } from "../../sdk/Settings";
import { Sound, SoundCache } from "../../sdk/utils/SoundCache";

export class ProtectRange extends BasePrayer {
  get name() {
    return "Protect from Range";
  }

  get groups(): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS];
  }

  levelRequirement(): number {
    return 34;
  }
  drainRate(): number {
    return 12;
  }

  isOverhead() {
    return true;
  }

  overheadImageReference() {
    return OverheadImg;
  }

  feature() {
    return "range";
  }

  playOnSound() {
    if (Settings.playsAudio) {
      SoundCache.play(new Sound(OnSound, 0.35));
    }
  }

  playOffSound() {
    if (Settings.playsAudio) {
      SoundCache.play(new Sound(OffSound, 0.35));
    }
  }
}
