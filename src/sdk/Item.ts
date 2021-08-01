import { filter } from "lodash";
import { InventoryControls } from "./controlpanels/InventoryControls";
import { ItemName } from "./ItemName";
import { Player } from "./Player";

export class Item {
  inventorySprite: HTMLImageElement;
  selected: boolean;
  serialNumber: string = String(Math.random() * 10000000000)

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

  get inventoryPosition(): number {
    return filter(InventoryControls.inventory.map((item: Item) => {
      return item.serialNumber;
    })).indexOf(this.serialNumber);
  }
  
  
  consumeItem() {
    InventoryControls.inventory[this.inventoryPosition] = null;
  }

  get inventoryImage (): string {
    return ''
  }
}