import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import Vial from '../../assets/images/potions/Vial.png';
import { Player } from "../Player";

export class Potion extends Item {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)
  vial: HTMLImageElement = ImageLoader.createImage(Vial)
  doses: number = 4;

  potionEffect(player: Player) {

  }
  get hasInventoryLeftClick(): boolean {
    return true;
  }

  get weight(): number {
    return 0.226;
  }
  updateInventorySprite() {
  }


  inventoryLeftClick(player: Player) {

    if (this.doses > 0) {
      this.potionEffect(player);
    }

    this.doses--;

    this.updateInventorySprite();
  }
  

}