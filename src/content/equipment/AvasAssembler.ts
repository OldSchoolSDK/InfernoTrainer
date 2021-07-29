import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Avas_assembler.png';
import { Cape } from "../../sdk/gear/Cape";

export class AvasAssembler extends Cape{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): string {
    return "Avas Assembler"
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 8
      },
      defence: {
        stab: 1,
        slash: 1,
        crush: 1,
        magic: 8,
        range: 2
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 2,
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