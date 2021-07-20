'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class RapidRestore extends BasePrayer {
  get name () {
    return 'Rapid Restore'
  }

  get groups (): string[] {
    return [] // TODO: Incorrect
  }

  isOverhead () {
    return false
  }

  feature () {
    return ''
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
