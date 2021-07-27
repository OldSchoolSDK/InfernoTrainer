'use strict'

import { BasePrayer, PrayerGroups } from '../../sdk/BasePrayer'
import { Settings } from '../../sdk/Settings'

export class ClarityOfThought extends BasePrayer {
  get name () {
    return 'Clarity of Thought'
  }

  get groups () {
    return [PrayerGroups.ATTACK]
  }

  drainRate(): number {
    return 3;
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
