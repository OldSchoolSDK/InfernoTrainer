import { Legs } from "../../sdk/gear/Legs";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Justiciar_legguards.png';
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";

export class JusticiarLegguards extends Legs{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  equipmentSetEffect(): SetEffect{
    return JusticiarSetEffect;
  }

  get inventoryImage () {
    return InventImage
  }
}