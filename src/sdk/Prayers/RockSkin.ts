'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import { Settings } from '../Settings'

export class RockSkin extends BasePrayer {
  get name () {
    return 'Rock Skin'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.DEFENCE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'defensive'
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
