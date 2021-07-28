import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Armadyl_chestplate.png';
import { Chest } from "../../sdk/gear/Chest";

export class ArmadylChestplate extends Chest{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}