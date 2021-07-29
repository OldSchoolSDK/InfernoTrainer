
import { ItemNames } from "../../sdk/ItemNames";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import OneDose from '../../assets/images/potions/Bastion_potion_1.png';
import TwoDose from '../../assets/images/potions/Bastion_potion_2.png';
import ThreeDose from '../../assets/images/potions/Bastion_potion_3.png';
import FourDose from '../../assets/images/potions/Bastion_potion_4.png';
import Vial from '../../assets/images/potions/Vial.png';
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion"

export class BastionPotion extends Potion {
  oneDose: HTMLImageElement = ImageLoader.createImage(OneDose)
  twoDose: HTMLImageElement = ImageLoader.createImage(TwoDose)
  threeDose: HTMLImageElement = ImageLoader.createImage(ThreeDose)
  fourDose: HTMLImageElement = ImageLoader.createImage(FourDose)

  constructor(doses: number = 4) {
    super();
    this.doses = doses;
    this.updateInventorySprite();
  }
  
  get inventoryImage () {
    if (this.doses === 4) {
      return FourDose;
    }else if (this.doses === 3) {
      return ThreeDose;
    }else if (this.doses === 2) {
      return TwoDose;
    }else if (this.doses === 1) {
      return OneDose;
    }
    return Vial;
  }
  get itemName(): ItemNames {
    return ItemNames.BASTION_POTION
  }
  
  inventoryLeftClick(player: Player) {

    if (this.doses > 0) {
      const rangedBoost = Math.floor(player.stats.defence * 0.10) + 4
      player.currentStats.range += rangedBoost;
      player.currentStats.range = Math.min(player.stats.range, player.stats.range + rangedBoost)

      const defenceBoost = Math.floor(player.stats.defence * 0.15) + 5
      player.currentStats.defence += defenceBoost;
      player.currentStats.defence = Math.min(player.currentStats.defence, player.stats.defence + defenceBoost);
    }

    this.doses--;

    this.updateInventorySprite();
  }

  updateInventorySprite() {
    if (this.doses === 4){
      this.inventorySprite = this.fourDose;      
    }else if (this.doses === 3) {
      this.inventorySprite = this.threeDose;
    }else if (this.doses === 2){
      this.inventorySprite = this.twoDose;
    }else if (this.doses === 1){
      this.inventorySprite = this.oneDose;
    }else {
      this.inventorySprite = this.vial;
    }
  }

}