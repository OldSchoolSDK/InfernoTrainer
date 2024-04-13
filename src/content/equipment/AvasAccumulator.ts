import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Avas_accumulator.png";
import { Cape } from "../../sdk/gear/Cape";
import { ItemName } from "../../sdk/ItemName";

export class AvasAccumulator extends Cape {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.AVAS_ACCUMULATOR;
  }
  get weight(): number {
    return 4.535;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 4,
      },
      defence: {
        stab: 0,
        slash: 1,
        crush: 0,
        magic: 4,
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
