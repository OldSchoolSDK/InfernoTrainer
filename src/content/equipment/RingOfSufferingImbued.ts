import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Ring_of_suffering_imbued.png';
import { Ring } from "../../sdk/gear/Ring";

export class RingOfSufferingImbued extends Ring{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
}