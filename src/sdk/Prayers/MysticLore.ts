'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class MysticLore extends BasePrayer {
  get name () {
    return 'Mystic Lore'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.MAGIC, PrayerGroups.DEFENCE]
  }

  drainRate(): number {
    return 6;
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveMagic'
  }

  playOnSound () {
    if (Settings.playsAudio) {
      // new Audio(OnSound).play();
    }
  }

  playOffSound () {
    if (Settings.playsAudio) {
      // new Audio(OffSound).play();
    }
  }
}
