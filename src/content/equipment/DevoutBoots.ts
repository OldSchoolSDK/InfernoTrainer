import { Feet } from "../../sdk/gear/Feet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Devout_boots.png';
import { ItemNames } from "../../sdk/ItemNames";

export class DevoutBoots extends Feet{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): ItemNames {
    return ItemNames.HOLY_BLESSING
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
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
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 5
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}