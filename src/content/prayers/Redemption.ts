'use strict'

import { BasePrayer, PrayerGroups } from '../../sdk/BasePrayer'
import { Settings } from '../../sdk/Settings'

export class Redemption extends BasePrayer {
  get name () {
    return 'Redemption'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS]
  }

  drainRate(): number {
    return 6;
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
