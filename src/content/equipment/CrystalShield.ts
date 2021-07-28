import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Crystal_shield.png';
import { Offhand } from "../../sdk/gear/Offhand";

export class CrystalShield extends Offhand{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}