'use strict'

import { BasePrayer, PrayerGroups } from './BasePrayer'
import OverheadImg from '../../assets/images/prayers/meleeOver.png'

import OnSound from '../../assets/sounds/meleeOn.ogg'
import OffSound from '../../assets/sounds/meleeOff.ogg'
import { Settings } from '../Settings'

export class ProtectMelee extends BasePrayer {
  get name () {
    return 'Protect from Melee'
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
    return 'melee'
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
