import { ItemNames } from "./ItemNames";
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

  get itemName(): ItemNames {
    return null
  }

  get weight(): number {
    return 0;
  }
  
  

  get inventoryImage (): string {
    return ''
  }
}