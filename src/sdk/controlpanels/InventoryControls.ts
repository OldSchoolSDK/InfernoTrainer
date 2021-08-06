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
import { Location } from '../../sdk/GameObject'
import { Collision } from '../Collision'

export class InventoryControls extends BaseControls {

  clickedDownItem: Item = null;
  clickedDownLocation: Location = null;
  cursorLocation: Location = null;
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

  static openInventorySlots(): number[] {
    const openSpots = [];
    for (let i=0; i<28; i++) {
      if (!InventoryControls.inventory[i]) {
        openSpots.push(i);
      }
    }
    return openSpots;
  }


  cursorMovedto(world: World, x: number, y: number) {

    this.cursorLocation = { x, y }
  }


  panelClickUp (world: World, x: number, y: number) {

    const sanitizedInventory = InventoryControls.inventory.map((item: Item, index: number) => {
      if (item) {
        return item;
      }
      return {
        inventoryPosition: index,
        isPlaceholder: true
      }
    });
    const clickedItem = first(filter(sanitizedInventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      const itemX = 20 + x2 * 43
      const itemY = 17 + (y2 + 1) * 35
      return Collision.collisionMath(x, y, 1, itemX, itemY, 32)
    })) as Item;

    const isPlaceholder: boolean = clickedItem && !!(clickedItem as any).isPlaceholder;

    if (!isPlaceholder && clickedItem && this.clickedDownItem === clickedItem) {
      if (clickedItem.hasInventoryLeftClick) {
        clickedItem.inventoryLeftClick(world.player);
        world.mapController.updateOrbsMask(null, null)
      } else {
        clickedItem.selected = true
      }
    }else if (!isPlaceholder && clickedItem){
      const theItemWereReplacing = clickedItem;
      const theItemWereReplacingPosition = clickedItem.inventoryPosition;
      const thisPosition = this.clickedDownItem.inventoryPosition;
      InventoryControls.inventory[theItemWereReplacingPosition] = this.clickedDownItem;
      InventoryControls.inventory[thisPosition] = theItemWereReplacing;
    }else{
      const thisPosition = this.clickedDownItem.inventoryPosition;
      InventoryControls.inventory[clickedItem.inventoryPosition] = this.clickedDownItem;
      InventoryControls.inventory[thisPosition] = null;
    }
    this.clickedDownItem = null;
    this.cursorLocation = null;
  }

  panelClickDown (world: World, x: number, y: number) {
    this.cursorLocation = { x, y }
    this.clickedDownLocation = {x, y};

    const clickedItem = first(filter(InventoryControls.inventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      const itemX = 20 + x2 * 43
      const itemY = 17 + (y2 + 1) * 35
      return Collision.collisionMath(x, y, 1, itemX, itemY, 32)
    })) as Item

    InventoryControls.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false))

    if (clickedItem) {
      this.clickedDownItem = clickedItem;
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
        if (inventoryItem === this.clickedDownItem) {
          world.viewportCtx.globalAlpha = 0.4;
          if (Pathing.dist(this.cursorLocation.x, this.cursorLocation.y, this.clickedDownLocation.x, this.clickedDownLocation.y) > 5) {
            world.viewportCtx.drawImage(sprite, this.cursorLocation.x + sprite.width / 2, this.cursorLocation.y - sprite.height / 2)
          }else{
            world.viewportCtx.drawImage(sprite, itemX + xOff, itemY + yOff)
          }
          world.viewportCtx.globalAlpha = 1;

        }else{
          world.viewportCtx.drawImage(sprite, itemX + xOff, itemY + yOff)
        }

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
