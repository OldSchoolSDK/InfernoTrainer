'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class SteelSkin extends BasePrayer {
  get name () {
    return 'Steel Skin'
  }

  get groups () {
    return [BasePrayer.groups.DEFENCE]
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
