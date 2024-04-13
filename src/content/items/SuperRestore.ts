import { ItemName } from "../../sdk/ItemName";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import OneDose from "../../assets/images/potions/Super_restore_1.png";
import TwoDose from "../../assets/images/potions/Super_restore_2.png";
import ThreeDose from "../../assets/images/potions/Super_restore_3.png";
import FourDose from "../../assets/images/potions/Super_restore_4.png";
import Vial from "../../assets/images/potions/Vial.png";
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion";

export class SuperRestore extends Potion {
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
    return ItemName.SUPER_RESTORE;
  }

  drink(player: Player) {
    super.drink(player);

    const prayerBonus = Math.floor(player.stats.prayer * 0.27) + 8;
    player.currentStats.prayer += prayerBonus;
    player.currentStats.prayer = Math.min(player.currentStats.prayer, player.stats.prayer);

    if (player.currentStats.attack < player.stats.attack) {
      const attackBonus = Math.floor(player.stats.attack * 0.25) + 8;
      player.currentStats.attack += attackBonus;
      player.currentStats.attack = Math.min(player.currentStats.attack, player.stats.attack);
    }

    if (player.currentStats.strength < player.stats.strength) {
      const strengthBonus = Math.floor(player.stats.strength * 0.25) + 8;
      player.currentStats.strength += strengthBonus;
      player.currentStats.strength = Math.min(player.currentStats.strength, player.stats.strength);
    }

    if (player.currentStats.range < player.stats.range) {
      const rangeBonus = Math.floor(player.stats.range * 0.25) + 8;
      player.currentStats.range += rangeBonus;
      player.currentStats.range = Math.min(player.currentStats.range, player.stats.range);
    }
    if (player.currentStats.magic < player.stats.magic) {
      const magicBonus = Math.floor(player.stats.magic * 0.25) + 8;
      player.currentStats.magic += magicBonus;
      player.currentStats.magic = Math.min(player.currentStats.magic, player.stats.magic);
    }
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
