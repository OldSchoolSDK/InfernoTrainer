'use strict'

import { BasePrayer } from './BasePrayer'
import { Settings } from '../Settings'

export class ProtectItem extends BasePrayer {
  get name () {
    return 'Protect Item'
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
