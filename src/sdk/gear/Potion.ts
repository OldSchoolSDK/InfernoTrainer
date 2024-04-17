import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import Vial from "../../assets/images/potions/Vial.png";
import { Player } from "../Player";

import PotionSound from "../../assets/sounds/liquid_2401.ogg";
import { Sound, SoundCache } from "../utils/SoundCache";

export class Potion extends Item {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);
  vial: HTMLImageElement = ImageLoader.createImage(Vial);
  doses = 4;

  constructor() {
    super();
    this.defaultAction = "Drink";
  }
  drink(player: Player) {
    player.interruptCombat();
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
    let didDrink = false;
    if (this.doses > 0) {
      didDrink = player.eats.drinkPotion(this);
    }
    if (this.doses === 0) {
      this.consumeItem(player);
    }
    if (didDrink) {
      SoundCache.play(new Sound(PotionSound, 0.1));
    }
    this.updateInventorySprite();
  }
}
