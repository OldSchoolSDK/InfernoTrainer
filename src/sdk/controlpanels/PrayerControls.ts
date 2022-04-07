
import PrayerPanel from '../../assets/images/panels/prayer.png'
import PrayerTab from '../../assets/images/tabs/prayer.png'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'
import { ControlPanelController } from '../ControlPanelController'
import { Viewport } from '../Viewport'
import { QueueableCommand, CommandStrength } from '../CommandQueue'
import { CommandOpCodes } from '../OpcodeBindings'

export class PrayerControls extends BaseControls {

  hasQuickPrayersActivated = false;

  get panelImageReference () {
    return PrayerPanel
  }

  get tabImageReference () {
    return PrayerTab
  }

  get keyBinding () {
    return Settings.prayer_key
  }

  deactivateAllPrayers() {

    Viewport.viewport.player.commandQueue.enqueue(
      QueueableCommand.create(CommandOpCodes.DISABLE_QUICK_PRAYERS, CommandStrength.NORMAL, 0, { }),
    );

    this.hasQuickPrayersActivated = false;

  }

  activateQuickPrayers(){
    this.hasQuickPrayersActivated = true;
    
    Viewport.viewport.player.commandQueue.enqueue(
      QueueableCommand.create(CommandOpCodes.ACTIVATE_QUICK_PRAYERS, CommandStrength.NORMAL, 0, { }),
    );
  }

  panelClickDown (x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;
    
    const gridX = x - 14
    const gridY = y - 22

    const clickedPrayer = Viewport.viewport.player.prayerController.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)]
    if (clickedPrayer && Viewport.viewport.player.currentStats.prayer > 0) {

      Viewport.viewport.player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.TOGGLE_PRAYER, CommandStrength.NORMAL, 0, { prayer: clickedPrayer }),
      );

      if (this.hasQuickPrayersActivated && Viewport.viewport.player.prayerController.activePrayers().length === 0) {
        ControlPanelController.controls.PRAYER.hasQuickPrayersActivated = false;
      }      
    }
  }

  get isAvailable (): boolean {
    return true;
  }
  
  draw (ctrl: ControlPanelController, x: number, y: number) {
    super.draw(ctrl, x, y)
    const scale = Settings.controlPanelScale;

    Viewport.viewport.player.prayerController.prayers.forEach((prayer, index) => {
      const x2 = index % 5
      const y2 = Math.floor(index / 5)

      if (prayer.isActive) {
        Viewport.viewport.context.beginPath()
        Viewport.viewport.context.fillStyle = '#D1BB7773'
        Viewport.viewport.context.arc(x + 10 * scale + (x2 + 0.5) * 36.8 * scale,  y + (16 + (y2 + 0.5) * 37) * scale, 18 * scale, 0, 2 * Math.PI)
        Viewport.viewport.context.fill()
      }
      if (Viewport.viewport.player.stats.prayer < prayer.levelRequirement()) {
        Viewport.viewport.context.beginPath()
        Viewport.viewport.context.fillStyle = '#00000073'
        Viewport.viewport.context.arc(x + 10 * scale + (x2 + 0.5) * 36.8 * scale,  y + (16 + (y2 + 0.5) * 37) * scale, 18 * scale, 0, 2 * Math.PI)
        Viewport.viewport.context.fill()
      }
    })
  }
}
