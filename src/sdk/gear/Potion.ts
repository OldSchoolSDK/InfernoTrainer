import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import Vial from '../../assets/images/potions/Vial.png';

export class Potion extends Item {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)
  vial: HTMLImageElement = ImageLoader.createImage(Vial)
  doses: number = 4;


  get hasInventoryLeftClick(): boolean {
    return true;
  }

  get weight(): number {
    return 0.226;
  }
  updateInventorySprite() {
  }

}