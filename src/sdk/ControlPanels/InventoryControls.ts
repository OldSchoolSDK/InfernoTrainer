import { first, filter } from 'lodash'
import InventoryPanel from '../../assets/images/panels/inventory.png'
import InventoryTab from '../../assets/images/tabs/inventory.png'
import { Pathing } from '../Pathing'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'
import { World } from '../World'
import { Item } from '../Item'
import { ControlPanelController } from '../ControlPanelController'
import { Weapon } from '../gear/Weapon'

export class InventoryControls extends BaseControls {

  static inventory: Item[] = new Array(28).fill(null);

  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return InventoryTab
  }

  get keyBinding () {
    return Settings.inventory_key
  }

  clickedPanel (world: World, x: number, y: number) {

    const clickedItem = first(filter(InventoryControls.inventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      inventoryItem.inventoryPosition = index
      const itemX = 20 + x2 * 43
      const itemY = 17 + (y2 + 1) * 35
      return Pathing.collisionMath(x, y, 1, itemX, itemY, 32)
    })) as Weapon

    InventoryControls.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false))

    if (clickedItem) {
      if (clickedItem.hasLeftClick) {
        clickedItem.leftClick(world.player);
        world.mapController.updateOrbsMask(null, null)
      } else {
        clickedItem.selected = true
      }
    }
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)

    InventoryControls.inventory.forEach((inventoryItem, index) => {
      const x2 = index % 4
      const y2 = Math.floor(index / 4)

      const itemX = 20 + x + (x2) * 43
      const itemY = 17 + y + (y2) * 35

      if (inventoryItem !== null) {


        
        world.viewportCtx.fillStyle = "#ffffff22"
        world.viewportCtx.fillRect(itemX, itemY, 32, 32)
        const sprite = inventoryItem.inventorySprite;

        const xOff = (32 - sprite.width)/2;
        const yOff = (32 - sprite.height)/2
        world.viewportCtx.drawImage(sprite, itemX + xOff, itemY + yOff)

        if (inventoryItem.selected) {
          world.viewportCtx.beginPath()
          world.viewportCtx.fillStyle = '#D1BB7773'
          world.viewportCtx.arc(itemX + 15, itemY + 17, 16, 0, 2 * Math.PI)
          world.viewportCtx.fill()
        }
      }
    })
  }
}
