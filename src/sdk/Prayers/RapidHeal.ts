'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class RapidHeal extends BasePrayer {
  get name () {
    return 'Rapid Heal'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.HEARTS]
  }

  isOverhead () {
    return false
  }

  feature () {
    return ''
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
