'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class Rigour extends BasePrayer {
  get name () {
    return 'Rigour'
  }

  get groups () {
    return [BasePrayer.groups.RANGE, BasePrayer.groups.DEFENCE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveRange'
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
