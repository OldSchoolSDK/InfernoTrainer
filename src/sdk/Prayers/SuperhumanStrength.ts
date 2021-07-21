'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class SuperhumanStrength extends BasePrayer {
  get name () {
    return 'Superhuman Strength'
  }

  get groups (): PrayerGroups[] {
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
