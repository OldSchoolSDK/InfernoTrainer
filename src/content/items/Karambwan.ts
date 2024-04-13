import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import KarambwanImage from "../../assets/images/potions/Cooked_karambwan.png";
import { Food } from "../../sdk/gear/Food";
import { Player } from "../../sdk/Player";

export class Karambwan extends Food {
  healAmount = 18;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(KarambwanImage);
  get inventoryImage() {
    return KarambwanImage;
  }
  get itemName(): ItemName {
    return ItemName.KARAMBWAN;
  }
  inventoryLeftClick(player: Player) {
    player.eats.eatComboFood(this);
  }
}
