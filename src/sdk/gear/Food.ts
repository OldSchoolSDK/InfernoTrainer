import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import { Player } from "../Player";

export class Food extends Item {
  healAmount: number = 0;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)


  eat(player: Player) {
    if (player.currentStats.hitpoint < player.stats.hitpoint) {
      player.currentStats.hitpoint += this.healAmount;
      player.currentStats.hitpoint = Math.min(player.currentStats.hitpoint, player.stats.hitpoint)
    }
  }

  get weight(): number {
    return 0.226;
  }

  updateInventorySprite() {
  }


  get hasInventoryLeftClick(): boolean {
    return true;
  }
  inventoryLeftClick(player: Player) {
    player.eatDelays.eatFood(this);
  }
}