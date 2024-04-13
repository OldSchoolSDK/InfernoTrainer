import { Helmet } from "../../sdk/gear/Helmet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Slayer_helmet_imbued.png";
import { ItemName } from "../../sdk/ItemName";

export class SlayerHelmet extends Helmet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.SLAYER_HELMET_I;
  }
  get weight(): number {
    return 2.267;
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
        magic: 3,
        range: 3,
      },
      defence: {
        stab: 30,
        slash: 32,
        crush: 27,
        magic: 10,
        range: 30,
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
