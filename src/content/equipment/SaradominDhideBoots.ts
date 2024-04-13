import { Feet } from "../../sdk/gear/Feet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Saradomin_d'hide_boots.png";
import { ItemName } from "../../sdk/ItemName";

export class SaradominDhideBoots extends Feet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.SARADOMIN_D_HIDE_BOOTS;
  }
  get weight(): number {
    return 1.4;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -10,
        range: 7,
      },
      defence: {
        stab: 4,
        slash: 4,
        crush: 4,
        magic: 4,
        range: 43,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 1,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
