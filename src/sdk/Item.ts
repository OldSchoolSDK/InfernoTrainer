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

  get itemName() {
    return 'n/a'
  }

  

  get inventoryImage (): string {
    return ''
  }
}