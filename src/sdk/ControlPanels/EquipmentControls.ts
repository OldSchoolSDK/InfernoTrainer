
import EquipmentPanel from '../../assets/images/panels/equipment.png'
import EquipmentTab from '../../assets/images/tabs/equipment.png'
import { BaseControls } from './BaseControls'
import UsedSpotBackground from '../../assets/images/interface/equipment_spot_used.png'
import { Settings } from '../Settings'
import { World } from '../World'
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

  clickedPanel (world: World, x: number, y: number) {

  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)

    if (world.player.weapon) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      world.viewportCtx.drawImage(world.player.weapon.inventorySprite, x + 32, y + 92)
    }
  }
}
