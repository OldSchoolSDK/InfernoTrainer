
import { Item } from "../../sdk/Item";
import { ItemNames } from "../../sdk/ItemNames";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import StamPot1 from '../../assets/images/potions/Stamina_Potion(1).png';
import StamPot2 from '../../assets/images/potions/Stamina_Potion(2).png';
import StamPot3 from '../../assets/images/potions/Stamina_Potion(3).png';
import StamPot4 from '../../assets/images/potions/Stamina_Potion(4).png';
import Vial from '../../assets/images/potions/Vial.png';
import { Player } from "../../sdk/Player";

export class StaminaPotion extends Item {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)
  stamPot1: HTMLImageElement = ImageLoader.createImage(StamPot1)
  stamPot2: HTMLImageElement = ImageLoader.createImage(StamPot2)
  stamPot3: HTMLImageElement = ImageLoader.createImage(StamPot3)
  stamPot4: HTMLImageElement = ImageLoader.createImage(StamPot4)
  vial: HTMLImageElement = ImageLoader.createImage(Vial)
  doses: number = 4;

  get inventoryImage () {
    if (this.doses === 4) {
      return StamPot4;
    }else if (this.doses === 3) {
      return StamPot3;
    }else if (this.doses === 2) {
      return StamPot2;
    }else if (this.doses === 1) {
      return StamPot1;
    }
    return Vial;
  }
  get itemName(): ItemNames {
    return ItemNames.BARROWS_GLOVES
  }
  get weight(): number {
    return 0.226;
  }

  get hasInventoryLeftClick(): boolean {
    return true;
  }
  
  inventoryLeftClick(player: Player) {

    if (this.doses > 0) {
      player.effects.stamina = 200; // 2 minutes = 200 ticks
      player.currentStats.run += 2000;
      player.currentStats.run = Math.min(Math.max(player.currentStats.run, 0), 10000);
    }
    this.doses--;

    this.updateInventorySprite();
  }

  updateInventorySprite() {
    if (this.doses === 4){
      this.inventorySprite = this.stamPot4;      
    }else if (this.doses === 3) {
      this.inventorySprite = this.stamPot3;
    }else if (this.doses === 2){
      this.inventorySprite = this.stamPot2;
    }else if (this.doses === 1){
      this.inventorySprite = this.stamPot1;
    }else {
      this.inventorySprite = this.vial;
    }
  }

  constructor(doses: number = 4) {
    super();
    this.doses = doses;
    this.updateInventorySprite();
  }

}