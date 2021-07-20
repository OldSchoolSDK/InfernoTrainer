
import EquipmentPanel from '../../assets/images/panels/equipment.png'
import EquipmentTab from '../../assets/images/tabs/equipment.png'
import { BaseControls } from './BaseControls'
import UsedSpotBackground from '../../assets/images/interface/equipment_spot_used.png'
import { Settings } from '../Settings'
import { Region } from '../Region'
import { ControlPanelController } from '../ControlPanelController'

export class EquipmentControls extends BaseControls {
  usedSpotBackground: HTMLImageElement;

  constructor () {
    super()
    this.usedSpotBackground = new Image()
    this.usedSpotBackground.src = UsedSpotBackground
  }

  get panelImageReference () {
    return EquipmentPanel
  }

  get tabImageReference () {
    return EquipmentTab
  }

  get keyBinding () {
    return Settings.equipment_key
  }

  clickedPanel (region: Region, x: number, y: number) {

  }

  draw (region: Region, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(region, ctrl, x, y)

    if (region.player.weapon) {
      ctrl.ctx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      ctrl.ctx.drawImage(region.player.weapon.inventorySprite, x + 32, y + 92)
    }
  }
}
