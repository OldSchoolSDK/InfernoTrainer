import { Necklace } from "../../sdk/gear/Necklace";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Necklace_of_anguish.png';
import { ItemName } from "../../sdk/ItemName";

export class NecklaceOfAnguish extends Necklace{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): ItemName {
    return ItemName.NECKLACE_OF_ANGUISH
  }
  get weight(): number {
    return 0.01;
  }
  
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 15
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 5,
        magicDamage: 0,
        prayer: 2
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}