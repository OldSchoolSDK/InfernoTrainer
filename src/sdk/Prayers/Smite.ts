'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class Smite extends BasePrayer {
  get name () {
    return 'Smite'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS] 
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'smite'
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
