import { Feet } from "../../sdk/gear/Feet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Ranger_boots.png";
import { ItemName } from "../../sdk/ItemName";

export class RangerBoots extends Feet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.RANGER_BOOTS;
  }
  get weight(): number {
    return 0.283;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 10,
        range: 8,
      },
      defence: {
        stab: 2,
        slash: 3,
        crush: 4,
        magic: 2,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
