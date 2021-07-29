import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from '../../assets/images/equipment/Armadyl_chainskirt.png';
import { Legs } from "../../sdk/gear/Legs";

export class ArmadylChainskirt extends Legs{
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  get inventoryImage () {
    return InventImage
  }
  get itemName(): string {
    return "Armadyl Chainskirt"
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: -6,
        slash: -6,
        crush: -6,
        magic: -10,
        range: 20
      },
      defence: {
        stab: 32,
        slash: 26,
        crush: 34,
        magic: 40,
        range: 33
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 1
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }
}