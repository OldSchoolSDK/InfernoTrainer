
import PrayerPanel from '../../assets/images/panels/prayer.png'
import PrayerTab from '../../assets/images/tabs/prayer.png'
import { intersection } from 'lodash'

import { BaseControls } from './BaseControls'
import { ProtectMelee } from '../../content/Prayers/ProtectMelee'
import { ProtectMage } from '../../content/prayers/ProtectMage'
import { ProtectRange } from '../../content/Prayers/ProtectRange'
import { Rigour } from '../../content/prayers/Rigour'
import { SharpEye } from '../../content/prayers/SharpEye'
import { HawkEye } from '../../content/prayers/HawkEye'
import { EagleEye } from '../../content/prayers/EagleEye'
import { MysticWill } from '../../content/prayers/MysticWill'
import { MysticLore } from '../../content/prayers/MysticLore'
import { MysticMight } from '../../content/prayers/MysticMight'
import { Augury } from '../../content/prayers/Augury'
import { ThickSkin } from '../../content/prayers/ThickSkin'
import { BurstOfStrength } from '../../content/prayers/BurstOfStrength'
import { ClarityOfThought } from '../../content/prayers/ClarityOfThought'
import { RockSkin } from '../../content/prayers/RockSkin'
import { SuperhumanStrength } from '../../content/prayers/SuperhumanStrength'
import { ImprovedReflexes } from '../../content/prayers/ImprovedReflexes'
import { SteelSkin } from '../../content/prayers/SteelSkin'
import { UltimateStrength } from '../../content/prayers/UltimateStrength'
import { IncredibleReflexes } from '../../content/prayers/IncredibleReflexes'
import { Chivalry } from '../../content/prayers/Chivalry'
import { Piety } from '../../content/prayers/Piety'
import { Settings } from '../Settings'
import { BasePrayer } from '../BasePrayer'
import { Game } from '../Game'
import { ControlPanelController } from '../ControlPanelController'
import { Retribution } from '../../content/prayers/Retribution'
import { Redemption } from '../../content/prayers/Redemption'
import { Smite } from '../../content/prayers/Smite'
import { Preserve } from '../../content/prayers/Preserve'
import { RapidRestore } from '../../content/prayers/RapidRestore'
import { RapidHeal } from '../../content/prayers/RapidHeal'
import { ProtectItem } from '../../content/prayers/ProtectItem'

export class PrayerControls extends BaseControls {

  hasQuickPrayersActivated: boolean = false;

  get panelImageReference () {
    return PrayerPanel
  }

  get tabImageReference () {
    return PrayerTab
  }

  get keyBinding () {
    return Settings.prayer_key
  }

  static prayers: BasePrayer[] = [
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
  ];

  getCurrentActivePrayers (): BasePrayer[] {
    return PrayerControls.prayers.filter((prayer) => prayer.isActive);
  }

  deactivateAllPrayers() {

    this.hasQuickPrayersActivated = false;
    PrayerControls.prayers.forEach((prayer) => prayer.deactivate());
  }

  activateQuickPrayers(){
    this.hasQuickPrayersActivated = true;
    
    PrayerControls.prayers.forEach((prayer) => {
      prayer.deactivate();
      if (prayer.name === 'Protect from Magic'){
        prayer.activate();
      }
      if (prayer.name === 'Rigour'){
        prayer.activate();
      }
    });

  }

  clickedPanel (game: Game, x: number, y: number) {
    const gridX = x - 14
    const gridY = y - 22

    const clickedPrayer = PrayerControls.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)]
    if (clickedPrayer && game.player.currentStats.prayer > 0) {

      this.getCurrentActivePrayers().forEach((prayer) => {
        if (intersection(prayer.groups, clickedPrayer.groups).length && prayer !== clickedPrayer) {
          prayer.deactivate()
        }
      })
      clickedPrayer.toggle()

      if (this.hasQuickPrayersActivated && this.getCurrentActivePrayers().length === 0) {
        ControlPanelController.controls.PRAYER.hasQuickPrayersActivated = false;
      }
      
    }
  }

  draw (game: Game, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(game, ctrl, x, y)

    PrayerControls.prayers.forEach((prayer, index) => {
      if (prayer.isActive) {
        const x2 = index % 5
        const y2 = Math.floor(index / 5)

        ctrl.ctx.beginPath()
        ctrl.ctx.fillStyle = '#D1BB7773'
        ctrl.ctx.arc(37 + (x2 + 0.5) * 36.8, 16 + y + (y2 + 0.5) * 37, 18, 0, 2 * Math.PI)
        ctrl.ctx.fill()
      }
    })
  }
}
