'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class Piety extends BasePrayer {
  get name () {
    return 'Piety'
  }

  get groups () {
    return [BasePrayer.groups.ATTACK, BasePrayer.groups.STRENGTH, BasePrayer.groups.DEFENCE]
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'offensiveAttack'
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
