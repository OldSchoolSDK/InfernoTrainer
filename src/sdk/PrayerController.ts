import { filter, find, intersection } from 'lodash';
import { Augury } from '../content/prayers/Augury';
import { BurstOfStrength } from '../content/prayers/BurstOfStrength';
import { Chivalry } from '../content/prayers/Chivalry';
import { ClarityOfThought } from '../content/prayers/ClarityOfThought';
import { EagleEye } from '../content/prayers/EagleEye';
import { HawkEye } from '../content/prayers/HawkEye';
import { ImprovedReflexes } from '../content/prayers/ImprovedReflexes';
import { IncredibleReflexes } from '../content/prayers/IncredibleReflexes';
import { MysticLore } from '../content/prayers/MysticLore';
import { MysticMight } from '../content/prayers/MysticMight';
import { MysticWill } from '../content/prayers/MysticWill';
import { Piety } from '../content/prayers/Piety';
import { Preserve } from '../content/prayers/Preserve';
import { ProtectItem } from '../content/prayers/ProtectItem';
import { ProtectMage } from '../content/prayers/ProtectMage';
import { ProtectMelee } from '../content/prayers/ProtectMelee';
import { ProtectRange } from '../content/prayers/ProtectRange';
import { RapidHeal } from '../content/prayers/RapidHeal';
import { RapidRestore } from '../content/prayers/RapidRestore';
import { Redemption } from '../content/prayers/Redemption';
import { Retribution } from '../content/prayers/Retribution';
import { Rigour } from '../content/prayers/Rigour';
import { RockSkin } from '../content/prayers/RockSkin';
import { SharpEye } from '../content/prayers/SharpEye';
import { Smite } from '../content/prayers/Smite';
import { SteelSkin } from '../content/prayers/SteelSkin';
import { SuperhumanStrength } from '../content/prayers/SuperhumanStrength';
import { ThickSkin } from '../content/prayers/ThickSkin';
import { UltimateStrength } from '../content/prayers/UltimateStrength';
import { BasePrayer, PrayerGroups } from './BasePrayer';

export class PrayerController {

  drainRate(): number {
    return this.activePrayers().reduce((a, b) => a + b.drainRate(), 0);
  }

  matchName(name: string): BasePrayer {
    return find(this.activePrayers(), (prayer: BasePrayer) => prayer.name === name);
  }
  
  activePrayers(): BasePrayer[] {
    return filter(this.prayers, (prayer: BasePrayer) => prayer.isActive);
  }

  matchFeature(feature: string): BasePrayer {
    return find(this.activePrayers(), (prayer: BasePrayer) => prayer.feature() === feature);
  }
  
  overhead(): BasePrayer {
    return find(this.activePrayers(), (prayer: BasePrayer) => intersection(prayer.groups, [PrayerGroups.OVERHEADS]).length) as BasePrayer
  }

  tick() {
    this.prayers.forEach((prayer) => prayer.tick())
  }

  prayers: BasePrayer[] = [
    new ThickSkin(),
    new BurstOfStrength(),
    new ClarityOfThought(),
    new SharpEye(),
    new MysticWill(),
    new RockSkin(),
    new SuperhumanStrength(),
    new ImprovedReflexes(),
    new RapidRestore(),
    new RapidHeal(),
    new ProtectItem(),
    new HawkEye(),
    new MysticLore(),
    new SteelSkin(),
    new UltimateStrength(),
    new IncredibleReflexes(),
    new ProtectMage(),
    new ProtectRange(),
    new ProtectMelee(),
    new EagleEye(),
    new MysticMight(),
    new Retribution(),
    new Redemption(),
    new Smite(),
    new Preserve(),
    new Chivalry(),
    new Piety(),
    new Rigour(),
    new Augury()
  ]

}