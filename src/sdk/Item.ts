import { InventoryControls } from "./controlpanels/InventoryControls";
import { ItemName } from "./ItemName";
import { Player } from "./Player";

export class Item {
  inventorySprite: HTMLImageElement;
  inventoryPosition: number;
  selected: boolean;

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
  
  
  consumeItem() {
    InventoryControls.inventory[this.inventoryPosition] = null;
  }

  get inventoryImage (): string {
    return ''
  }
}