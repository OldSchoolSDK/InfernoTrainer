'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class HawkEye extends BasePrayer {
  get name () {
    return 'Hawk Eye'
  }

  get groups () {
    return [BasePrayer.groups.RANGE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return [BasePrayer.groups.RANGE]
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
