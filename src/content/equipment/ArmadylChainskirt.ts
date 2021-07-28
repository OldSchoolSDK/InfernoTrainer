import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Armadyl_chainskirt.png';
import { Legs } from "../../sdk/gear/Legs";

export class ArmadylChainskirt extends Legs{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}