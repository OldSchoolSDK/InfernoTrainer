'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class Augury extends BasePrayer {
  get name () {
    return 'Augury'
  }

  get groups () {
    return [PrayerGroups.MAGIC, PrayerGroups.DEFENCE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveMagic'
  }

  drainRate(): number {
    return 24;
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
