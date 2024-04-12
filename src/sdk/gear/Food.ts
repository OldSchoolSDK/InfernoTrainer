import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import { Player } from "../Player";

export class Food extends Item {
  healAmount = 0;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  constructor() {
    super();

    this.defaultAction = "Eat";
  }

  eat(player: Player) {
    player.interruptCombat();
    if (player.currentStats.hitpoint < player.stats.hitpoint) {
      player.currentStats.hitpoint += this.healAmount;
      player.currentStats.hitpoint = Math.min(player.currentStats.hitpoint, player.stats.hitpoint);
    }
  }

  get weight(): number {
    return 0.226;
  }

  updateInventorySprite() {
    // Override me
  }

  get hasInventoryLeftClick(): boolean {
    return true;
  }
  inventoryLeftClick(player: Player) {
    player.eats.eatFood(this);
  }
}
