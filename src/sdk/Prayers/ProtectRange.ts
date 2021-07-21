'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import OverheadImg from '../../assets/images/prayers/rangeOver.png'

import OnSound from '../../assets/sounds/rangeOn.ogg'
import OffSound from '../../assets/sounds/rangeOff.ogg'
import { Settings } from '../Settings'

export class ProtectRange extends BasePrayer {
  get name () {
    return 'Protect from Range'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS]
  }

  isOverhead () {
    return true
  }

  overheadImageReference () {
    return OverheadImg
  }

  feature () {
    return 'range'
  }

  playOnSound () {
    if (Settings.playsAudio) {
      new Audio(OnSound).play()
    }
  }

  playOffSound () {
    if (Settings.playsAudio) {
      new Audio(OffSound).play()
    }
  }
}
