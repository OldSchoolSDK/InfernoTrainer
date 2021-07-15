
import PrayerPanel from "../../assets/images/panels/prayer.png";
import PrayerTab from "../../assets/images/tabs/prayer.png";
import _ from "lodash";
import { BrowserUtils } from "../Utils/BrowserUtils";

import { BaseControls } from "./BaseControls";
import { ProtectMelee } from "../Prayers/ProtectMelee";
import { ProtectMage } from "../Prayers/ProtectMage";
import { ProtectRange } from "../Prayers/ProtectRange";
import { Rigour } from "../Prayers/Rigour";
import { SharpEye } from "../Prayers/SharpEye";
import { HawkEye } from "../Prayers/HawkEye";
import { EagleEye } from "../Prayers/EagleEye";
import { MysticWill } from "../Prayers/MysticWill";
import { MysticLore } from "../Prayers/MysticLore";
import { MysticMight } from "../Prayers/MysticMight";
import { Augury } from "../Prayers/Augury";
import { ThickSkin } from "../Prayers/ThickSkin";
import { BurstOfStrength } from "../Prayers/BurstOfStrength";
import { ClarityOfThought } from "../Prayers/ClarityOfThought";
import { RockSkin } from "../Prayers/RockSkin";
import { SuperhumanStrength } from "../Prayers/SuperhumanStrength";
import { ImprovedReflexes } from "../Prayers/ImprovedReflexes";
import { SteelSkin } from "../Prayers/SteelSkin";
import { UltimateStrength } from "../Prayers/UltimateStrength";
import { IncredibleReflexes } from "../Prayers/IncredibleReflexes";
import { Chivalry } from "../Prayers/Chivalry";
import { Piety } from "../Prayers/Piety";

export class PrayerControls extends BaseControls{

  get panelImageReference() {
    return PrayerPanel;
  }

  get tabImageReference() {
    return PrayerTab;
  }


  get keyBinding() {
    return BrowserUtils.getQueryVar("pray_key") || "3";
  }


  static prayers = [
    new ThickSkin(),
    new BurstOfStrength(),
    new ClarityOfThought(),
    new SharpEye(),
    new MysticWill(),
    new RockSkin(),
    new SuperhumanStrength(),
    new ImprovedReflexes,
    'Rapid Restore',
    'Rapid Heal',
    'Protect Item',
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
    'Retribution',
    'Redemption',
    'Smite',
    'Preserve',
    new Chivalry(),
    new Piety(),
    new Rigour(),
    new Augury()
  ];

  getCurrentActivePrayers() {
    return PrayerControls.prayers.filter((prayer) => prayer.isActive);
  }

  clickedPanel(region, x, y){
    const gridX = x - 14;
    const gridY = y - 22;

    const clickedPrayer = PrayerControls.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)];
    if (clickedPrayer && typeof clickedPrayer !== 'string') {
      this.getCurrentActivePrayers().forEach((prayer) => {
        if (!prayer || !prayer.groups) {
          return;
        }
        if (_.intersection(prayer.groups, clickedPrayer.groups).length && prayer != clickedPrayer){
          prayer.deactivate();
        }
      })

      clickedPrayer.activate();
    }
  }

  draw(region, ctrl, x, y) {

    super.draw(region, ctrl, x, y);

    PrayerControls.prayers.forEach((prayer, index) => {

      const x = index 
      if (prayer.isActive) {

        const x2 = index % 5;
        const y2 = Math.floor(index / 5);
        
        ctrl.ctx.beginPath();
        ctrl.ctx.fillStyle = "#D1BB7773";
        ctrl.ctx.arc(37 + (x2 + 0.5) * 36.8, 16 + y + (y2 + 0.5) * 37, 18, 0, 2 * Math.PI);
        ctrl.ctx.fill();
      }

    });
    
  }
}
