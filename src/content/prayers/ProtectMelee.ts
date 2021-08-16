'use strict'

import { BasePrayer, PrayerGroups } from '../../sdk/BasePrayer'
import OverheadImg from '../../assets/images/prayers/meleeOver.png'

import OnSound from '../../assets/sounds/meleeOn.ogg'
import OffSound from '../../assets/sounds/meleeOff.ogg'
import { Settings } from '../../sdk/Settings'

export class ProtectMelee extends BasePrayer {
  get name () {
    return 'Protect from Melee'
  }

  get groups (): PrayerGroups[] {
    return [PrayerGroups.OVERHEADS]
  }

  levelRequirement(): number {
    return 43;
  }
  drainRate(): number {
    return 12;
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
