import { Helmet } from "../../sdk/gear/Helmet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Justiciar_faceguard.png';
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";

export class JusticiarFaceguard extends Helmet{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  equipmentSetEffect(): SetEffect{
    return JusticiarSetEffect;
  }

  get inventoryImage () {
    return InventImage
  }
}