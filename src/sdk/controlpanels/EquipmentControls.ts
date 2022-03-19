
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
    let scale = 0.75;

    x = x / scale;
    y = y / scale;
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
    let scale = 0.75;

    if (world.player.equipment.helmet) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 84 * scale, y + 11 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const helmetSprite = world.player.equipment.helmet.inventorySprite;
      world.viewport.context.drawImage(helmetSprite, x + (102 - Math.floor(helmetSprite.width / 2) ) * scale, y + (29 - Math.floor(helmetSprite.height / 2)) * scale, helmetSprite.width * scale, helmetSprite.height * scale)
    }
    if (world.player.equipment.cape) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 43 * scale, y + 50 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const capeSprite = world.player.equipment.cape.inventorySprite;
      world.viewport.context.drawImage(capeSprite, x + (61 - Math.floor(capeSprite.width / 2)) * scale , y + (69 - Math.floor(capeSprite.height / 2)) * scale, capeSprite.width * scale, capeSprite.height * scale)
    }
    if (world.player.equipment.necklace) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 84 * scale, y + 50 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const necklaceSprite = world.player.equipment.necklace.inventorySprite;
      world.viewport.context.drawImage(necklaceSprite, x + (102 - Math.floor(necklaceSprite.width / 2)) * scale , y + (69 - Math.floor(necklaceSprite.height / 2)) * scale, necklaceSprite.width * scale, necklaceSprite.height * scale)
    }
    if (world.player.equipment.ammo) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 124 * scale, y + 50 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const ammoSprite = world.player.equipment.ammo.inventorySprite;
      world.viewport.context.drawImage(ammoSprite, x + (142 - Math.floor(ammoSprite.width / 2)) * scale , y + (69 - Math.floor(ammoSprite.height / 2)) * scale, ammoSprite.width * scale, ammoSprite.height * scale)
    }
    if (world.player.equipment.weapon) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 28 * scale, y + 89 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const weaponSprite = world.player.equipment.weapon.inventorySprite;
      world.viewport.context.drawImage(weaponSprite, x + (46 - Math.floor(weaponSprite.width / 2)) * scale , y + (107 - Math.floor(weaponSprite.height / 2)) * scale, weaponSprite.width * scale, weaponSprite.height * scale)
    }
    if (world.player.equipment.chest) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 84 * scale, y + 89 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const chestSprite = world.player.equipment.chest.inventorySprite;
      world.viewport.context.drawImage(chestSprite, x + (102 - Math.floor(chestSprite.width / 2) ) * scale, y + (107 - Math.floor(chestSprite.height / 2)) * scale, chestSprite.width * scale, chestSprite.height * scale)
    }
    if (world.player.equipment.offhand) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 140 * scale, y + 89 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const offhandSprite = world.player.equipment.offhand.inventorySprite;
      world.viewport.context.drawImage(offhandSprite, x + (158 - Math.floor(offhandSprite.width / 2) ) * scale, y + (107 - Math.floor(offhandSprite.height / 2)) * scale, offhandSprite.width * scale, offhandSprite.height * scale)
    }
    if (world.player.equipment.legs) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 84 * scale, y + 129 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const legsSprite = world.player.equipment.legs.inventorySprite;
      world.viewport.context.drawImage(legsSprite, x + (102 - Math.floor(legsSprite.width / 2) ) * scale, y + (147 - Math.floor(legsSprite.height / 2)) * scale, legsSprite.width * scale, legsSprite.height * scale)
    }
    if (world.player.equipment.gloves) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 28 * scale, y + 169 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const glovesSprite = world.player.equipment.gloves.inventorySprite;
      world.viewport.context.drawImage(glovesSprite, x + (46 - Math.floor(glovesSprite.width / 2)) * scale , y + (186 - Math.floor(glovesSprite.height / 2)) * scale, glovesSprite.width * scale, glovesSprite.height * scale)
    }

    if (world.player.equipment.feet) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 84 * scale, y + 169 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const feetSprite = world.player.equipment.feet.inventorySprite;
      world.viewport.context.drawImage(feetSprite, x + (102 - Math.floor(feetSprite.width / 2)) * scale , y + (186 - Math.floor(feetSprite.height / 2)) * scale, feetSprite.width * scale, feetSprite.height * scale)
    }


    if (world.player.equipment.ring) {
      world.viewport.context.drawImage(this.usedSpotBackground, x + 140 * scale, y + 169 * scale, this.usedSpotBackground.width * scale, this.usedSpotBackground.height * scale)
      const ringSprite = world.player.equipment.ring.inventorySprite;
      world.viewport.context.drawImage(ringSprite, x + (158 - ringSprite.width / 2) * scale , y + (186 - ringSprite.height / 2) * scale, ringSprite.width * scale, ringSprite.height * scale)
    }

  }
}
