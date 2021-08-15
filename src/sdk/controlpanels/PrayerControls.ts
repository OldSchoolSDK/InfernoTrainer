
import PrayerPanel from '../../assets/images/panels/prayer.png'
import PrayerTab from '../../assets/images/tabs/prayer.png'
import { intersection } from 'lodash'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'
import { World } from '../World'
import { ControlPanelController } from '../ControlPanelController'

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

  deactivateAllPrayers(world: World) {

    this.hasQuickPrayersActivated = false;
    world.player.prayerController.activePrayers().forEach((prayer) => prayer.deactivate());
  }

  activateQuickPrayers(world: World){
    this.hasQuickPrayersActivated = true;
    
    world.player.prayerController.activePrayers().forEach((prayer) => {
      prayer.deactivate();
      if (prayer.name === 'Protect from Magic'){
        prayer.activate();
      }
      if (prayer.name === 'Rigour'){
        prayer.activate();
      }
    });

  }

  panelClickDown (world: World, x: number, y: number) {
    const gridX = x - 14
    const gridY = y - 22

    const clickedPrayer = world.player.prayerController.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)]
    if (clickedPrayer && world.player.currentStats.prayer > 0) {

      clickedPrayer.toggle()

      if (this.hasQuickPrayersActivated && world.player.prayerController.activePrayers().length === 0) {
        ControlPanelController.controls.PRAYER.hasQuickPrayersActivated = false;
      }      
    }
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)

    world.player.prayerController.prayers.forEach((prayer, index) => {
      if (prayer.isActive || prayer.isLit) {
        const x2 = index % 5
        const y2 = Math.floor(index / 5)

        world.viewport.context.beginPath()
        world.viewport.context.fillStyle = '#D1BB7773'
        world.viewport.context.arc(37 + (x2 + 0.5) * 36.8, 16 + y + (y2 + 0.5) * 37, 18, 0, 2 * Math.PI)
        world.viewport.context.fill()
      }
    })
  }
}
