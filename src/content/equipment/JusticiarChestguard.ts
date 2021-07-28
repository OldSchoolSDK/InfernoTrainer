import { Chest } from "../../sdk/gear/Chest";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Justiciar_chestguard.png';
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";

export class JusticiarChestguard extends Chest{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  equipmentSetEffect(): SetEffect{
    return JusticiarSetEffect;
  }

  get inventoryImage () {
    return InventImage
  }
}