'use strict'

import { BasePrayer, PrayerGroups } from '../../sdk/BasePrayer'
import { Settings } from '../../sdk/Settings'

export class MysticWill extends BasePrayer {
  get name () {
    return 'Mystic Will'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.MAGIC, PrayerGroups.DEFENCE]
  }
  drainRate(): number {
    return 3;
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
