'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class UltimateStrength extends BasePrayer {
  get name () {
    return 'Ultimate Strength'
  }

  get groups () {
    return [PrayerGroups.STRENGTH]
  }

  drainRate(): number {
    return 12;
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
