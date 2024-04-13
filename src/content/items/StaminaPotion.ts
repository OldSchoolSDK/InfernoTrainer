import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import OneDose from "../../assets/images/potions/Stamina_potion_1.png";
import TwoDose from "../../assets/images/potions/Stamina_potion_2.png";
import ThreeDose from "../../assets/images/potions/Stamina_potion_3.png";
import FourDose from "../../assets/images/potions/Stamina_potion_4.png";
import Vial from "../../assets/images/potions/Vial.png";
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion";

export class StaminaPotion extends Potion {
  oneDose: HTMLImageElement = ImageLoader.createImage(OneDose);
  twoDose: HTMLImageElement = ImageLoader.createImage(TwoDose);
  threeDose: HTMLImageElement = ImageLoader.createImage(ThreeDose);
  fourDose: HTMLImageElement = ImageLoader.createImage(FourDose);

  constructor(doses = 4) {
    super();
    this.doses = doses;
    this.updateInventorySprite();
  }

  get inventoryImage() {
    if (this.doses === 4) {
      return FourDose;
    } else if (this.doses === 3) {
      return ThreeDose;
    } else if (this.doses === 2) {
      return TwoDose;
    } else if (this.doses === 1) {
      return OneDose;
    }
    return Vial;
  }
  get itemName(): ItemName {
    return ItemName.STAMINA_POTION;
  }

  drink(player: Player) {
    super.drink(player);

    player.effects.stamina = 200; // 2 minutes = 200 ticks
    player.currentStats.run += 2000;
    player.currentStats.run = Math.min(Math.max(player.currentStats.run, 0), 10000);
  }

  updateInventorySprite() {
    if (this.doses === 4) {
      this.inventorySprite = this.fourDose;
    } else if (this.doses === 3) {
      this.inventorySprite = this.threeDose;
    } else if (this.doses === 2) {
      this.inventorySprite = this.twoDose;
    } else if (this.doses === 1) {
      this.inventorySprite = this.oneDose;
    } else {
      this.inventorySprite = this.vial;
    }
  }
}
