import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Holy_blessing.png';
import { Ammo } from "../../sdk/gear/Ammo";

export class HolyBlessing extends Ammo{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}