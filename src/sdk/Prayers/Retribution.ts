'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class Retribution extends BasePrayer {
  get name () {
    return 'Retribution'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS] // TODO: Incorrect
  }
  
  drainRate(): number {
    return 3;
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
