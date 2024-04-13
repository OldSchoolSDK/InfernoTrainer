import { Helmet } from "../../sdk/gear/Helmet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Saradomin_coif.png";
import { ItemName } from "../../sdk/ItemName";

export class SaradominCoif extends Helmet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.SARADOMIN_COIF;
  }
  get weight(): number {
    return 0.9;
  }

  get inventoryImage() {
    return InventImage;
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -1,
        range: 7,
      },
      defence: {
        stab: 4,
        slash: 7,
        crush: 10,
        magic: 4,
        range: 8,
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
