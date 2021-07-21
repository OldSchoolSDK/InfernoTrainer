'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class ProtectItem extends BasePrayer {
  get name () {
    return 'Protect Item'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.PROTECTITEM] // TODO: Incorrect
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
