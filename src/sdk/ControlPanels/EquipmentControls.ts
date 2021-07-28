
import EquipmentPanel from '../../assets/images/panels/equipment.png'
import EquipmentTab from '../../assets/images/tabs/equipment.png'
import { BaseControls } from './BaseControls'
import UsedSpotBackground from '../../assets/images/interface/equipment_spot_used.png'
import { Settings } from '../Settings'
import { World } from '../World'
import { ControlPanelController } from '../ControlPanelController'
import { ImageLoader } from '../utils/ImageLoader'

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

    if (world.player.equipment.weapon) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      const weaponSprite = world.player.equipment.weapon.inventorySprite;
      world.viewportCtx.drawImage(weaponSprite, x + 46 - weaponSprite.width / 2 , y + 107 - weaponSprite.height / 2)

    }
    if (world.player.equipment.helmet) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 11)
      const helmetSprite = world.player.equipment.helmet.inventorySprite;
      world.viewportCtx.drawImage(helmetSprite, x + 101 - helmetSprite.width / 2 , y + 28 - helmetSprite.height / 2)
    }

    
  }
}
