'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class Redemption extends BasePrayer {
  get name () {
    return 'Redemption'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS]
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
