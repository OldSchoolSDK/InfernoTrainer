import { first, filter } from 'lodash'
import InventoryPanel from '../../assets/images/panels/inventory.png'
import InventoryTab from '../../assets/images/tabs/inventory.png'
import { Pathing } from '../Pathing'
import { BaseControls } from './BaseControls'
import { Settings } from '../Settings'
import { Item } from '../Item'
import { ControlPanelController } from '../ControlPanelController'
import { Location } from "../../sdk/Location"
import { Collision } from '../Collision'
import { MenuOption } from '../ContextMenu'
import { MapController } from '../MapController'
import { Viewport } from '../Viewport'
import { CommandStrength, QueueableCommand } from '../CommandQueue'
import { CommandOpCodes } from '../OpcodeBindings'
/* eslint-disable @typescript-eslint/no-explicit-any */

export class InventoryControls extends BaseControls {

  clickedDownItem: Item = null;
  clickedDownLocation: Location = null;
  cursorLocation: Location = null;

  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return InventoryTab
  }

  get keyBinding () {
    return Settings.inventory_key
  }


  cursorMovedto(x: number, y: number) {

    this.cursorLocation = { x, y }
  }

  get isAvailable (): boolean {
    return true;
  }
  
  get appearsOnLeftInMobile (): boolean {
    return false;
  }
  
  panelRightClick(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    let menuOptions: MenuOption[] = []
    // mobs.forEach((mob) => {
    //   menuOptions = menuOptions.concat(mob.contextActions(x, y))
    // })


    const clickedItem = first(filter(Viewport.viewport.player.inventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      const itemX = 20 + x2 * 43
      const itemY = 17 + (y2 + 1) * 35
      return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale)
    })) as Item

    if (clickedItem) {
      menuOptions = menuOptions.concat(clickedItem.contextActions(Viewport.viewport.player))
    }

    Viewport.viewport.contextMenu.setMenuOptions(menuOptions)
    Viewport.viewport.contextMenu.setActive()
  }


  panelClickUp (x: number, y: number) {
    if (!this.clickedDownItem) {
      return;
    }
    const scale = Settings.controlPanelScale;

    const sanitizedInventory = Viewport.viewport.player.inventory.map((item: Item, index: number) => {
      if (item) {
        return item;
      }
      return {
        inventoryPosition: () => index,
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
      return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale)
    })) as Item;

    const isPlaceholder: boolean = clickedItem && !!(clickedItem as any).isPlaceholder;

    if (!isPlaceholder && clickedItem && this.clickedDownItem === clickedItem) {
      if (clickedItem.hasInventoryLeftClick) {
        
        Viewport.viewport.player.commandQueue.enqueue(
          QueueableCommand.create(CommandOpCodes.INVENTORY_LEFT_CLICK, CommandStrength.STRONG, 0, { item: clickedItem }),
        );  
        
      } else {
        clickedItem.selected = true
      }
    }else if (!isPlaceholder && clickedItem){
      Viewport.viewport.player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.INVENTORY_SWAP_ITEMS_POSITIONS, CommandStrength.STRONG, 0, { item1: clickedItem, item2: this.clickedDownItem }),
      );
    }else if (clickedItem){
      Viewport.viewport.player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.INVENTORY_MOVE_ITEM, CommandStrength.STRONG, 0, { item: this.clickedDownItem, newPosition: clickedItem.inventoryPosition(Viewport.viewport.player) }),
      );
    }
    this.clickedDownItem = null;
    this.cursorLocation = null;
  }

  panelClickDown ( x: number, y: number) {
    this.cursorLocation = { x, y }
    this.clickedDownLocation = {x, y};
    const scale = Settings.controlPanelScale;

    const clickedItem = first(filter(Viewport.viewport.player.inventory, (inventoryItem: Item, index: number) => {
      if (!inventoryItem) {
        return
      }
      const x2 = index % 4
      const y2 = Math.floor(index / 4)
      const itemX = 20 + x2 * 43
      const itemY = 17 + (y2 + 1) * 35
      return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale)
    })) as Item

    Viewport.viewport.player.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false))

    if (clickedItem) {
      this.clickedDownItem = clickedItem;
    }
  }

  draw (ctrl: ControlPanelController, x: number, y: number) {
    super.draw(ctrl, x, y)

    const scale = Settings.controlPanelScale;
    Viewport.viewport.player.inventory.forEach((inventoryItem, index) => {
      const x2 = index % 4
      const y2 = Math.floor(index / 4)

      const itemX = x + (20 + (x2) * 43) * scale;
      const itemY = y + (17 + (y2) * 35) * scale;

      if (inventoryItem !== null) {
        
        Viewport.viewport.context.fillStyle = "#ffffff22"
        // Viewport.viewport.context.fillRect(itemX, itemY, 32, 32)
        const sprite = inventoryItem.inventorySprite;

        const xOff = Math.floor((32 - sprite.width) / 2);
        const yOff = Math.floor((32 - sprite.height) / 2)
        if (inventoryItem === this.clickedDownItem) {
          Viewport.viewport.context.globalAlpha = 0.4;
          if (Pathing.dist(this.cursorLocation.x, this.cursorLocation.y, this.clickedDownLocation.x, this.clickedDownLocation.y) > 5) {
            Viewport.viewport.context.drawImage(
              sprite, 
              this.cursorLocation.x + sprite.width * scale / 2, 
              this.cursorLocation.y - sprite.height * scale / 2, 
              sprite.width * scale, 
              sprite.height * scale
              );
          }else{
            Viewport.viewport.context.drawImage(sprite, 
              itemX + xOff, 
              itemY + yOff, 
              sprite.width * scale, 
              sprite.height * scale
              );
          }
          Viewport.viewport.context.globalAlpha = 1;

        }else{
          Viewport.viewport.context.drawImage(
            sprite, 
            itemX + xOff, 
            itemY + yOff, 
            sprite.width * scale, 
            sprite.height * scale);
        }

        if (inventoryItem.selected) {
          Viewport.viewport.context.beginPath()
          Viewport.viewport.context.fillStyle = '#D1BB7773'
          Viewport.viewport.context.arc(itemX + 15 * scale, itemY + 17 * scale, 16 * scale, 0, 2 * Math.PI)
          Viewport.viewport.context.fill()
        }
      }
    })
  }
}
