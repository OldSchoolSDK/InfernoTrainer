'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class SharpEye extends BasePrayer {
  get name () {
    return 'Sharp Eye'
  }

  get groups (): PrayerGroups[] {
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
