
import PrayerPanel from "../../assets/images/panels/prayer.png";
import PrayerTab from "../../assets/images/tabs/prayer.png";
import Pathing from "../Pathing";
import Point from "../Point";
import BaseControls from "../ControlPanels/BaseControls";
import ProtectMelee from "./ProtectMelee";
import ProtectMage from "./ProtectMage";
import ProtectRange from "./ProtectRange";
import _ from "lodash";
import BrowserUtils from "../BrowserUtils";

export default class PrayerControls extends BaseControls{

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
    'Thick Skin',
    'Burst of Strength',
    'Clarity of Thought',
    'Sharp Eye',
    'Mystic Will',
    'Rock Skin',
    'Superhuman Strength',
    'Improved Reflexes',
    'Rapid Restore',
    'Rapid Heal',
    'Protect Item',
    'Hawk Eye',
    'Mystic Lore',
    'Steel Skin',
    'Ultimate Strength',
    'Incredible Reflexes',
    new ProtectMage(),
    new ProtectRange(),
    new ProtectMelee(),
    'Eagle Eye',
    'Mystic Might',
    'Retribution',
    'Redemption',
    'Smite',
    'Preserve',
    'Chivalry',
    'Piety',
    'Rigour',
    'Augury'
  ];

  getCurrentActivePrayers() {
    return PrayerControls.prayers.filter((prayer) => prayer.isActive);
  }

  clickedPanel(stage, x, y){
    const gridX = x - 14;
    const gridY = y - 22;

    const clickedPrayer = PrayerControls.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)];
    if (clickedPrayer && typeof clickedPrayer !== 'string') {
      this.getCurrentActivePrayers().forEach((prayer) => {
        if (!prayer || !prayer.groups) {
          return;
        }
        if (_.intersection(prayer.groups, clickedPrayer.groups) && prayer != clickedPrayer){
          prayer.deactivate();
        }
      })

      clickedPrayer.activate();
    }
  }

  draw(ctx, x, y) {

    super.draw(ctx, x, y);

    PrayerControls.prayers.forEach((prayer, index) => {

      const x = index 
      if (prayer.isActive) {

        const x2 = index % 5;
        const y2 = Math.floor(index / 5);
        
        ctx.beginPath();

        ctx.fillStyle = "#D1BB7773";
        ctx.arc(24 + x + (x2 + 0.5) * 35, 21 + y + (y2 + 0.5) * 35, 18, 0, 2 * Math.PI);
        ctx.fill();
      }

    });
    
  }
}
