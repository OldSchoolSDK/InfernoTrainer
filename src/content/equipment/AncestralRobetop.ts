import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Ancestral_robe_top.png';
import { Chest } from "../../sdk/gear/Chest";
import { ItemNames } from "../../sdk/ItemNames";

export class AncestralRobetop extends Chest{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): ItemNames {
    return ItemNames.ANCESTRAL_ROBETOP
  }
  get weight(): number {
    return 2.721;
  }


  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 35,
        range: -8
      },
      defence: {
        stab: 42,
        slash: 31,
        crush: 51,
        magic: 28,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0.02,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}