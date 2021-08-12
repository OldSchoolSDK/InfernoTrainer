import { Item } from "../Item";
import { ImageLoader } from "../utils/ImageLoader";
import Vial from '../../assets/images/potions/Vial.png';
import { Player } from "../Player";

export class Potion extends Item {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)
  vial: HTMLImageElement = ImageLoader.createImage(Vial)
  doses: number = 4;


  constructor() {
    super();
    this.defaultAction = 'Drink';
  }
  drink(player: Player) {

  }

  get weight(): number {
    return 0.226;
  }
  updateInventorySprite() {
  }


  get hasInventoryLeftClick(): boolean {
    return true;
  }
  inventoryLeftClick(player: Player) {
    if (this.doses > 0) {
      player.eats.drinkPotion(this);
    }
    if (this.doses === 0){
      this.consumeItem(player);
    }
    this.updateInventorySprite();
  }

  


}