'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class ClarityOfThought extends BasePrayer {
  get name () {
    return 'Clarity of Thought'
  }

  get groups () {
    return [BasePrayer.groups.ATTACK]
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
