'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class Preserve extends BasePrayer {
  get name () {
    return 'Preserve'
  }

  get groups (): string[] {
    return [] // TODO: Incorrect
  }

  isOverhead () {
    return false
  }

  feature () {
    return 'preserve'
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
