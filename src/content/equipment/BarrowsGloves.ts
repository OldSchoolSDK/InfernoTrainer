import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Barrows_gloves.png';
import { Gloves } from "../../sdk/gear/Gloves";

export class BarrowsGloves extends Gloves{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}