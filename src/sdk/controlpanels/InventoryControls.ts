import { first, filter } from "lodash";
import InventoryPanel from "../../assets/images/panels/inventory.png";
import InventoryTab from "../../assets/images/tabs/inventory.png";
import { Pathing } from "../Pathing";
import { BaseControls } from "./BaseControls";
import { Settings } from "../Settings";
import { Item } from "../Item";
import { ControlPanelController } from "../ControlPanelController";
import { Location } from "../../sdk/Location";
import { Collision } from "../Collision";
import { MenuOption } from "../ContextMenu";
import { MapController } from "../MapController";
import { Viewport } from "../Viewport";
import { InputController } from "../Input";
import { Trainer } from "../Trainer";

/* eslint-disable @typescript-eslint/no-explicit-any */

const MS_PER_ANTI_DRAG = 20; // per client tick
const DRAG_RADIUS = 5;

export class InventoryControls extends BaseControls {
  antiDragTimerAt = 0;

  clickedDownItem: Item = null;
  clickedDownLocation: Location = null;
  draggedItem = false;


  cursorLocation: Location = null;
  // this is the visual representation of the inventory, which updates instantly when items are moved but is refreshed
  // every tick
  inventoryCache: Item[] = [];

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return InventoryTab;
  }

  get keyBinding() {
    return Settings.inventory_key;
  }

  cursorMovedto(x: number, y: number) {
    this.cursorLocation = { x, y };
    this.draggedItem ||= Pathing.dist(this.cursorLocation.x, this.cursorLocation.y, this.clickedDownLocation.x, this.clickedDownLocation.y) > DRAG_RADIUS && this.canDrag();
  }

  get isAvailable(): boolean {
    return true;
  }

  get appearsOnLeftInMobile(): boolean {
    return false;
  }

  override onWorldTick() {
    this.inventoryCache = [...Trainer.player.inventory];
  }

  panelRightClick(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    let menuOptions: MenuOption[] = [];

    const clickedItem = first(
      filter(Trainer.player.inventory, (inventoryItem: Item, index: number) => {
        if (!inventoryItem) {
          return;
        }
        const x2 = index % 4;
        const y2 = Math.floor(index / 4);
        const itemX = 20 + x2 * 43;
        const itemY = 17 + (y2 + 1) * 35;
        return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale);
      }),
    ) as Item;

    if (clickedItem) {
      menuOptions = menuOptions.concat(clickedItem.contextActions(Trainer.player));
    }

    Viewport.viewport.contextMenu.setMenuOptions(menuOptions);
    Viewport.viewport.contextMenu.setActive();
  }

  panelClickUp(x: number, y: number) {
    if (!this.clickedDownItem) {
      return;
    }
    const scale = Settings.controlPanelScale;

    const sanitizedInventory = Trainer.player.inventory.map((item: Item, index: number) => {
      if (item) {
        return item;
      }
      return {
        inventoryPosition: () => index,
        isPlaceholder: true,
      };
    });
    const clickedItem = first(
      filter(sanitizedInventory, (inventoryItem: Item, index: number) => {
        if (!inventoryItem) {
          return;
        }
        const x2 = index % 4;
        const y2 = Math.floor(index / 4);
        const itemX = 20 + x2 * 43;
        const itemY = 17 + (y2 + 1) * 35;
        return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale);
      }),
    ) as Item;

    const isPlaceholder: boolean = clickedItem && !!(clickedItem as any).isPlaceholder;

    if (!isPlaceholder && clickedItem && this.clickedDownItem === clickedItem && !this.draggedItem) {
      // clicking an item
      if (clickedItem.hasInventoryLeftClick) {
        InputController.controller.queueAction(() => clickedItem.inventoryLeftClick(Trainer.player));
        MapController.controller.updateOrbsMask(null, null);
      } else {
        clickedItem.selected = true;
      }
      this.clickedDownItem = null;
      this.cursorLocation = null;
      return;
    }
    
    if (!this.canDrag()) {
      this.clickedDownItem = null;
      this.cursorLocation = null;
      return;
    }
    
    if (!isPlaceholder && clickedItem) {
      const theItemWereReplacing = clickedItem;
      const theItemWereReplacingPosition = clickedItem.inventoryPosition(Trainer.player);
      const thisPosition = this.clickedDownItem.inventoryPosition(Trainer.player);
      // update the local cache immediately, but the real position updates upon server tick
      this.inventoryCache[theItemWereReplacingPosition] = this.clickedDownItem;
      this.inventoryCache[thisPosition] = theItemWereReplacing;
      InputController.controller.queueAction(() => {
        Trainer.player.swapItemPositions(theItemWereReplacingPosition, thisPosition);
      });
    } else if (clickedItem) {
      const thisPosition = this.clickedDownItem.inventoryPosition(Trainer.player);
      const clickedPosition = clickedItem.inventoryPosition(Trainer.player);
      this.inventoryCache[clickedPosition] = this.clickedDownItem;
      this.inventoryCache[thisPosition] = null;
      InputController.controller.queueAction(() => {
        Trainer.player.swapItemPositions(clickedPosition, thisPosition);
      });
    }
    this.clickedDownItem = null;
    this.cursorLocation = null;
  }

  panelClickDown(x: number, y: number) {
    this.cursorLocation = { x, y };
    this.clickedDownLocation = { x, y };
    this.draggedItem = false;
    const scale = Settings.controlPanelScale;

    const clickedItem = first(
      filter(this.inventoryCache, (inventoryItem: Item, index: number) => {
        if (!inventoryItem) {
          return;
        }
        const x2 = index % 4;
        const y2 = Math.floor(index / 4);
        const itemX = 20 + x2 * 43;
        const itemY = 17 + (y2 + 1) * 35;
        return Collision.collisionMath(x, y, 1, itemX * scale, itemY * scale, 32 * scale);
      }),
    ) as Item;

    Trainer.player.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false));

    if (clickedItem) {
      this.clickedDownItem = clickedItem;
      this.antiDragTimerAt = Date.now() + Settings.antiDrag * MS_PER_ANTI_DRAG;
    }
  }

  private canDrag() {
    return Date.now() >= this.antiDragTimerAt;
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);

    const scale = Settings.controlPanelScale;
    this.inventoryCache.forEach((inventoryItem, index) => {
      const x2 = index % 4;
      const y2 = Math.floor(index / 4);

      const itemX = x + (20 + x2 * 43) * scale;
      const itemY = y + (17 + y2 * 35) * scale;

      if (inventoryItem !== null) {
        context.fillStyle = "#ffffff22";
        // Viewport.viewport.context.fillRect(itemX, itemY, 32, 32)
        const sprite = inventoryItem.inventorySprite;

        const xOff = Math.floor((32 - sprite.width) / 2);
        const yOff = Math.floor((32 - sprite.height) / 2);
        if (inventoryItem === this.clickedDownItem) {
          context.globalAlpha = 0.4;
          if (this.draggedItem) {
            context.drawImage(
              sprite,
              x + this.cursorLocation.x - (sprite.width * scale) / 2,
              y + this.cursorLocation.y - (sprite.height * scale) / 2,
              sprite.width * scale,
              sprite.height * scale,
            );
          } else {
            context.drawImage(sprite, itemX + xOff, itemY + yOff, sprite.width * scale, sprite.height * scale);
          }
          context.globalAlpha = 1;
        } else {
          context.drawImage(sprite, itemX + xOff, itemY + yOff, sprite.width * scale, sprite.height * scale);
        }

        if (inventoryItem.selected) {
          context.beginPath();
          context.fillStyle = "#D1BB7773";
          context.arc(itemX + 15 * scale, itemY + 17 * scale, 16 * scale, 0, 2 * Math.PI);
          context.fill();
        }
      }
    });
  }
}
