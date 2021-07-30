
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

  panelClickDown (world: World, x: number, y: number) {
    if (x > 84 && y > 11 && x < 84 + 36 && y < 11 + 36) {
      // helmet
      world.player.equipment.helmet.unequip(world.player);
    }else if (x > 43 && y > 50 && x < 43 + 36 && y < 50 + 36) {
      // cape
      world.player.equipment.cape.unequip(world.player);
    }else if (x > 84 && y > 50 && x < 84 + 36 && y < 50 + 36) {
      // necklace
      world.player.equipment.necklace.unequip(world.player);
    }else if (x > 124 && y > 50 && x < 124 + 36 && y < 50 + 36) {
      // ammo
      world.player.equipment.ammo.unequip(world.player);
    }else if (x > 28 && y > 89 && x < 28 + 36 && y < 89 + 36) {
      // weapon 
      world.player.equipment.weapon.unequip(world.player);
    }else if (x > 84 && y > 89 && x < 84 + 36 && y < 89 + 36) {
      // chest
      world.player.equipment.chest.unequip(world.player);
    }else if (x > 140 && y > 89 && x < 140 + 36 && y < 89 + 36) {
      // offhand
      world.player.equipment.offhand.unequip(world.player);
    }else if (x > 84 && y > 129 && x < 84 + 36 && y < 129 + 36) {
      // legs
      world.player.equipment.legs.unequip(world.player);
    }else if (x > 28 && y > 169 && x < 28 + 36 && y < 169 + 36) {
      // gloves
      world.player.equipment.gloves.unequip(world.player);
    }else if (x > 84 && y > 169 && x < 84 + 36 && y < 169 + 36) {
      // feet
      world.player.equipment.feet.unequip(world.player);
    }else if (x > 140 && y > 169 && x < 140 + 36 && y < 169 + 36) {
      // ring
      world.player.equipment.ring.unequip(world.player);
    }
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)
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
    if (world.player.equipment.ammo) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 124, y + 50)
      const ammoSprite = world.player.equipment.ammo.inventorySprite;
      world.viewportCtx.drawImage(ammoSprite, x + 142 - ammoSprite.width / 2 , y + 69 - ammoSprite.height / 2)
    }
    if (world.player.equipment.weapon) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      const weaponSprite = world.player.equipment.weapon.inventorySprite;
      world.viewportCtx.drawImage(weaponSprite, x + 46 - weaponSprite.width / 2 , y + 107 - weaponSprite.height / 2)
    }
    if (world.player.equipment.chest) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 89)
      const chestSprite = world.player.equipment.chest.inventorySprite;
      world.viewportCtx.drawImage(chestSprite, x + 102 - chestSprite.width / 2 , y + 107 - chestSprite.height / 2)
    }
    if (world.player.equipment.offhand) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 140, y + 89)
      const offhandSprite = world.player.equipment.offhand.inventorySprite;
      world.viewportCtx.drawImage(offhandSprite, x + 158 - offhandSprite.width / 2 , y + 107 - offhandSprite.height / 2)
    }
    if (world.player.equipment.legs) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 129)
      const legsSprite = world.player.equipment.legs.inventorySprite;
      world.viewportCtx.drawImage(legsSprite, x + 102 - legsSprite.width / 2 , y + 147 - legsSprite.height / 2)
    }
    if (world.player.equipment.gloves) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 28, y + 169)
      const glovesSprite = world.player.equipment.gloves.inventorySprite;
      world.viewportCtx.drawImage(glovesSprite, x + 46 - glovesSprite.width / 2 , y + 186 - glovesSprite.height / 2)
    }

    if (world.player.equipment.feet) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 84, y + 169)
      const feetSprite = world.player.equipment.feet.inventorySprite;
      world.viewportCtx.drawImage(feetSprite, x + 102 - feetSprite.width / 2 , y + 186 - feetSprite.height / 2)
    }


    if (world.player.equipment.ring) {
      world.viewportCtx.drawImage(this.usedSpotBackground, x + 140, y + 169)
      const ringSprite = world.player.equipment.ring.inventorySprite;
      world.viewportCtx.drawImage(ringSprite, x + 158 - ringSprite.width / 2 , y + 186 - ringSprite.height / 2)
    }

  }
}
