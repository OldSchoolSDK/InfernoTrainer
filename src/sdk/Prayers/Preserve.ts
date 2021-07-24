'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class Preserve extends BasePrayer {
  get name () {
    return 'Preserve'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.PRESERVE] // TODO: Incorrect
  }
  
  drainRate(): number {
    return 2;
  }
  
  isOverhead () {
    return false
  }

  feature () {
    return 'preserve'
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
