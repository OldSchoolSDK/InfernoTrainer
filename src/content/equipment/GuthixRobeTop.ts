import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Guthix_robe_top.png";
import { Chest } from "../../sdk/gear/Chest";
import { ItemName } from "../../sdk/ItemName";

export class GuthixRobetop extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.GUTHIX_ROBE_TOP;
  }

  get weight(): number {
    return 1.8;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 4,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 4,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 6,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
