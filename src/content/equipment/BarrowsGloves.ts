import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Barrows_gloves.png';
import { Gloves } from "../../sdk/gear/Gloves";

export class BarrowsGloves extends Gloves{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): string {
    return "Barrows Gloves"
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 12,
        slash: 12,
        crush: 12,
        magic: 6,
        range: 12
      },
      defence: {
        stab: 12,
        slash: 12,
        crush: 12,
        magic: 6,
        range: 12
      },
      other: {
        meleeStrength: 12,
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