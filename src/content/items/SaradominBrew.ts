import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import OneDose from "../../assets/images/potions/Saradomin_brew_1.png";
import TwoDose from "../../assets/images/potions/Saradomin_brew_2.png";
import ThreeDose from "../../assets/images/potions/Saradomin_brew_3.png";
import FourDose from "../../assets/images/potions/Saradomin_brew_4.png";
import Vial from "../../assets/images/potions/Vial.png";
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion";

export class SaradominBrew extends Potion {
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
    return ItemName.SARADOMIN_BREW;
  }

  drink(player: Player) {
    super.drink(player);

    const healAmount = Math.floor(player.stats.hitpoint * 0.15) + 2;
    player.currentStats.hitpoint += healAmount;
    player.currentStats.hitpoint = Math.max(
      1,
      Math.min(player.currentStats.hitpoint, player.stats.hitpoint + healAmount),
    );

    const defenceBoost = Math.floor(player.currentStats.defence * 0.2) + 2;
    const maxDefenceBoost = Math.floor(player.stats.defence * 0.2) + 2;
    player.currentStats.defence += defenceBoost;
    player.currentStats.defence = Math.max(
      1,
      Math.min(player.currentStats.defence, player.stats.defence + maxDefenceBoost),
    );

    const attackNerf = Math.floor(player.currentStats.attack * 0.1) + 2;
    player.currentStats.attack -= attackNerf;
    player.currentStats.attack = Math.max(1, Math.min(player.currentStats.attack, player.stats.attack + attackNerf));

    const strengthNerf = Math.floor(player.currentStats.strength * 0.1) + 2;
    player.currentStats.strength -= strengthNerf;
    player.currentStats.strength = Math.max(
      1,
      Math.min(player.currentStats.strength, player.stats.strength + strengthNerf),
    );

    const rangeNerf = Math.floor(player.currentStats.range * 0.1) + 2;
    player.currentStats.range -= rangeNerf;
    player.currentStats.range = Math.max(1, Math.min(player.currentStats.range, player.stats.range + rangeNerf));

    const magicNerf = Math.floor(player.currentStats.magic * 0.1) + 2;
    player.currentStats.magic -= magicNerf;
    player.currentStats.magic = Math.max(1, Math.min(player.currentStats.magic, player.stats.magic + magicNerf));
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
