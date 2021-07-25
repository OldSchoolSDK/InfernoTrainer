
import EquipmentPanel from '../../assets/images/panels/equipment.png'
import EquipmentTab from '../../assets/images/tabs/equipment.png'
import { BaseControls } from './BaseControls'
import UsedSpotBackground from '../../assets/images/interface/equipment_spot_used.png'
import { Settings } from '../Settings'
import { Game } from '../Game'
import { ControlPanelController } from '../ControlPanelController'
import { ImageLoader } from '../Utils/ImageLoader'

export class EquipmentControls extends BaseControls {
  usedSpotBackground: HTMLImageElement = ImageLoader.createImage(UsedSpotBackground)

  get panelImageReference () {
    return EquipmentPanel
  }

  get tabImageReference () {
    return EquipmentTab
  }

  get keyBinding () {
    return Settings.equipment_key
  }

  clickedPanel (game: Game, x: number, y: number) {

  }

  draw (game: Game, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(game, ctrl, x, y)

    if (game.player.weapon) {
      ctrl.ctx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      ctrl.ctx.drawImage(game.player.weapon.inventorySprite, x + 32, y + 92)
    }
  }
}
