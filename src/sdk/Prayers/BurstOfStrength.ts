'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class BurstOfStrength extends BasePrayer {
  get name () {
    return 'Burst of Strength'
  }

  get groups () {
    return [PrayerGroups.STRENGTH]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveStrength'
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
