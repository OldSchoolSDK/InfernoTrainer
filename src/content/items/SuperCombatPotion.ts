import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import OneDose from "../../assets/images/potions/Super_combat_potion_1.png";
import TwoDose from "../../assets/images/potions/Super_combat_potion_2.png";
import ThreeDose from "../../assets/images/potions/Super_combat_potion_3.png";
import FourDose from "../../assets/images/potions/Super_combat_potion_4.png";
import Vial from "../../assets/images/potions/Vial.png";
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion";

export class SuperCombatPotion extends Potion {
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
    return ItemName.SUPER_COMBAT_POTION;
  }

  drink(player: Player) {
    super.drink(player);

    const boost = (stat: keyof Player["stats"]) => {
      const boost = Math.floor(player.stats[stat] * 0.15) + 5;
      player.currentStats[stat] += boost;
      player.currentStats[stat] = Math.min(player.currentStats[stat], player.stats[stat] + boost);
    }
    boost('strength');
    boost('attack');
    boost('defence');
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
