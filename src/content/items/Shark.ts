import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import SharkImage from "../../assets/images/potions/Shark.png";
import { Food } from "../../sdk/gear/Food";

export class Shark extends Food {
  healAmount = 20;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(SharkImage);
  get inventoryImage() {
    return SharkImage;
  }
  get itemName(): ItemName {
    return ItemName.SHARK;
  }
}
