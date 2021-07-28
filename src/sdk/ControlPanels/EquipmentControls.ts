
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
      world.viewportCtx.drawImage(helmetSprite, x + 102 - helmetSprite.width / 2 , y + 29 - helmetSprite.height / 2)
    }
    if (world.player.equipment.cape) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 43, y + 50)
      const capeSprite = world.player.equipment.cape.inventorySprite;
      world.viewportCtx.drawImage(capeSprite, x + 61 - capeSprite.width / 2 , y + 69 - capeSprite.height / 2)
    }
    if (world.player.equipment.necklace) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 50)
      const necklaceSprite = world.player.equipment.necklace.inventorySprite;
      world.viewportCtx.drawImage(necklaceSprite, x + 102 - necklaceSprite.width / 2 , y + 69 - necklaceSprite.height / 2)
    }
    if (world.player.equipment.chest) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 89)
      const chestSprite = world.player.equipment.chest.inventorySprite;
      world.viewportCtx.drawImage(chestSprite, x + 102 - chestSprite.width / 2 , y + 108 - chestSprite.height / 2)
    }

    if (world.player.equipment.legs) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 129)
      const legsSprite = world.player.equipment.legs.inventorySprite;
      world.viewportCtx.drawImage(legsSprite, x + 102 - legsSprite.width / 2 , y + 147 - legsSprite.height / 2)
    }


    if (world.player.equipment.feet) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 169)
      const feetSprite = world.player.equipment.feet.inventorySprite;
      world.viewportCtx.drawImage(feetSprite, x + 102 - feetSprite.width / 2 , y + 186 - feetSprite.height / 2)
    }


  }
}
