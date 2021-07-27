import { first, filter } from 'lodash'
import InventoryPanel from '../../assets/images/panels/inventory.png'
import InventoryTab from '../../assets/images/tabs/inventory.png'
import { Pathing } from '../Pathing'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'
import { World } from '../World'
import { Item } from '../Item'
import { ControlPanelController } from '../ControlPanelController'
import { Weapon } from '../Weapons/Weapon'

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
    let itemX, itemY
    const clickedItem = first(filter(InventoryControls.inventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      inventoryItem.inventoryPosition = index
      itemX = 16 + (x2) * 43
      itemY = 16 + (y2 + 1) * 35
      return Pathing.collisionMath(x, y, 1, itemX, itemY, 35)
    })) as Weapon

    InventoryControls.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false))

    if (clickedItem) {
      const isLeftClickable = true
      if (isLeftClickable) { // "Is this something with a left click action"
        const currentWeapon = world.player.weapon
        InventoryControls.inventory[clickedItem.inventoryPosition] = currentWeapon
        world.player.weapon = clickedItem
        world.player.aggro = null
        world.player.bonuses = clickedItem.bonuses // temp code
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

      const itemX = 21 + x + (x2) * 43
      const itemY = 17 + y + (y2) * 35

      if (inventoryItem !== null) {
        world.viewportCtx.drawImage(
          inventoryItem.inventorySprite,
          itemX,
          itemY,
          32,
          32
        )

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
