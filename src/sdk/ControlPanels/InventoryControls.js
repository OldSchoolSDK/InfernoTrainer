import _ from 'lodash'
import InventoryPanel from '../../assets/images/panels/inventory.png'
import InventoryTab from '../../assets/images/tabs/inventory.png'
import { Pathing } from '../Pathing'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'

export class InventoryControls extends BaseControls {
  constructor (inventory) {
    super()

    InventoryControls.inventory = []
  }

  static inventory = new Array(28).fill(null);

  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return InventoryTab
  }

  get keyBinding () {
    return Settings.inventory_key
  }

  clickedPanel (region, x, y) {
    let itemX, itemY
    const clickedItem = _.first(_.filter(InventoryControls.inventory, (inventoryItem, index) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      inventoryItem.inventoryPosition = index
      itemX = 16 + (x2) * 43
      itemY = 16 + (y2 + 1) * 35
      return Pathing.collisionMath(x, y, 1, itemX, itemY, 35)
    }))

    InventoryControls.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false))

    if (clickedItem) {
      const isLeftClickable = true
      if (isLeftClickable) { // "Is this something with a left click action"
        const currentWeapon = region.player.weapon
        InventoryControls.inventory[clickedItem.inventoryPosition] = currentWeapon
        region.player.weapon = clickedItem
        region.player.aggro = null
        region.player.bonuses = clickedItem.bonuses // temp code
      } else {
        clickedItem.selected = true
      }
    }
  }

  draw (region, ctrl, x, y) {
    super.draw(region, ctrl, x, y)

    InventoryControls.inventory.forEach((inventoryItem, index) => {
      const x2 = index % 4
      const y2 = Math.floor(index / 4)

      const itemX = 21 + x + (x2) * 43
      const itemY = 17 + y + (y2) * 35

      if (inventoryItem !== null) {
        ctrl.ctx.drawImage(
          inventoryItem.inventorySprite,
          itemX,
          itemY,
          32,
          32
        )

        if (inventoryItem.selected) {
          ctrl.ctx.beginPath()
          ctrl.ctx.fillStyle = '#D1BB7773'
          ctrl.ctx.arc(itemX + 15, itemY + 17, 16, 0, 2 * Math.PI)
          ctrl.ctx.fill()
        }
      }
    })
  }
}
