import { filter, find, intersection } from "lodash";
import { Augury } from "../content/prayers/Augury";
import { BurstOfStrength } from "../content/prayers/BurstOfStrength";
import { Chivalry } from "../content/prayers/Chivalry";
import { ClarityOfThought } from "../content/prayers/ClarityOfThought";
import { EagleEye } from "../content/prayers/EagleEye";
import { HawkEye } from "../content/prayers/HawkEye";
import { ImprovedReflexes } from "../content/prayers/ImprovedReflexes";
import { IncredibleReflexes } from "../content/prayers/IncredibleReflexes";
import { MysticLore } from "../content/prayers/MysticLore";
import { MysticMight } from "../content/prayers/MysticMight";
import { MysticWill } from "../content/prayers/MysticWill";
import { Piety } from "../content/prayers/Piety";
import { Preserve } from "../content/prayers/Preserve";
import { ProtectItem } from "../content/prayers/ProtectItem";
import { ProtectMage } from "../content/prayers/ProtectMage";
import { ProtectMelee } from "../content/prayers/ProtectMelee";
import { ProtectRange } from "../content/prayers/ProtectRange";
import { RapidHeal } from "../content/prayers/RapidHeal";
import { RapidRestore } from "../content/prayers/RapidRestore";
import { Redemption } from "../content/prayers/Redemption";
import { Retribution } from "../content/prayers/Retribution";
import { Rigour } from "../content/prayers/Rigour";
import { RockSkin } from "../content/prayers/RockSkin";
import { SharpEye } from "../content/prayers/SharpEye";
import { Smite } from "../content/prayers/Smite";
import { SteelSkin } from "../content/prayers/SteelSkin";
import { SuperhumanStrength } from "../content/prayers/SuperhumanStrength";
import { ThickSkin } from "../content/prayers/ThickSkin";
import { UltimateStrength } from "../content/prayers/UltimateStrength";
import { BasePrayer, PrayerGroups } from "./BasePrayer";
import { Player } from "./Player";

export class PrayerController {
  drainCounter = 0;
  player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  tick(player: Player) {
    // "transfer" prayers from client to "server"
    this.prayers.forEach((prayer) => prayer.tick());

    // Deactivate any incompatible prayers
    const conflictingPrayers = {};
    player.prayerController.prayers.forEach((activePrayer) => {
      activePrayer.groups.forEach((group) => {
        if (!conflictingPrayers[group]) {
          conflictingPrayers[group] = [];
        }
        conflictingPrayers[group].push(activePrayer);
      });
    });

    for (const feature in conflictingPrayers) {
      conflictingPrayers[feature].sort((p1: BasePrayer, p2: BasePrayer) => p2.lastActivated - p1.lastActivated);
      conflictingPrayers[feature].shift();
      conflictingPrayers[feature].forEach((prayer: BasePrayer) => {
        prayer.isLit = false;
        prayer.isActive = false;
      });
    }

    // calc prayer drain

    const prayerDrainThisTick = this.drainRate();
    this.drainCounter += prayerDrainThisTick;
    while (this.drainCounter > this.player.prayerDrainResistance) {
      this.player.currentStats.prayer--;
      this.drainCounter -= this.player.prayerDrainResistance;
    }

    // deactivate prayers when out of prayer

    if (this.player.currentStats.prayer <= 0) {
      this.activePrayers().forEach((prayer) => prayer.deactivate());
      this.player.currentStats.prayer = 0;
    }
  }

  drainRate(): number {
    return this.activePrayers().reduce((a, b) => a + b.drainRate(), 0);
  }

  findPrayerByName(name: string): BasePrayer {
    return find(this.prayers, (prayer: BasePrayer) => prayer.name === name);
  }

  isPrayerActiveByName(name: string): BasePrayer {
    return find(this.activePrayers(), (prayer: BasePrayer) => prayer.name === name);
  }

  activePrayers(): BasePrayer[] {
    return filter(this.prayers, (prayer: BasePrayer) => prayer.isActive);
  }

  matchFeature(feature: string): BasePrayer {
    return find(this.activePrayers(), (prayer: BasePrayer) => prayer.feature() === feature);
  }

  overhead(): BasePrayer {
    return find(
      this.activePrayers(),
      (prayer: BasePrayer) => intersection(prayer.groups, [PrayerGroups.OVERHEADS]).length,
    ) as BasePrayer;
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
    new Augury(),
  ];
}
