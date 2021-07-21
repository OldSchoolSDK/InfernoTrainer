'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class HawkEye extends BasePrayer {
  get name () {
    return 'Hawk Eye'
  }

  get groups () {
    return [PrayerGroups.RANGE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveRange'
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
