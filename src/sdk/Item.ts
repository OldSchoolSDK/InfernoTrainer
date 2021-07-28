import { Player } from "./Player";

export class Item {
  inventorySprite: HTMLImageElement;
  inventoryPosition: number;
  selected: boolean;

  get hasInventoryLeftClick(): boolean {
    return false;
  }
  inventoryLeftClick(player: Player) {
    // world.player.equipment.weapon = clickedItem
  }

  get name() {
    return 'n/a'
  }

  get inventoryImage (): string {
    return ''
  }
}