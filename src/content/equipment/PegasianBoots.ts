import { Feet } from "../../sdk/gear/Feet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Pegasian_boots.png';
import { ItemNames } from "../../sdk/ItemNames";

export class PegasianBoots extends Feet{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): ItemNames {
    return ItemNames.PEGASIAN_BOOTS
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -12,
        range: 12
      },
      defence: {
        stab: 5,
        slash: 5,
        crush: 5,
        magic: 5,
        range: 5
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}