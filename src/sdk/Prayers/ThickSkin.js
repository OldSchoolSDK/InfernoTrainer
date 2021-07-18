'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class ThickSkin extends BasePrayer {
  get name () {
    return 'Thick Skin'
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
