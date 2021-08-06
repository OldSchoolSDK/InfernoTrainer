import { filter } from "lodash";
import { InventoryControls } from "./controlpanels/InventoryControls";
import { ItemName } from "./ItemName";
import { Player } from "./Player";

export class Item {
  inventorySprite: HTMLImageElement;
  selected: boolean;
  _serialNumber: string;

  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random())
    }
    return this._serialNumber;
  }

  get hasInventoryLeftClick(): boolean {
    return false;
  }

  inventoryLeftClick(player: Player) {
    
  }

  get itemName(): ItemName {
    return null
  }

  get weight(): number {
    return 0;
  }

  inventoryPosition(player: Player): number {
    return player.inventory.map((item: Item) => {
      if (!item) {
        return null;
      }
      return item.serialNumber;
    }).indexOf(this.serialNumber);
  }
  
  
  consumeItem(player: Player) {
    player.inventory[this.inventoryPosition(player)] = null;
  }

  get inventoryImage (): string {
    return ''
  }
}