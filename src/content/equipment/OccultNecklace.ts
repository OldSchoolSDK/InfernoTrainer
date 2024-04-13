import { Necklace } from "../../sdk/gear/Necklace";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Occult_necklace.png";
import { ItemName } from "../../sdk/ItemName";

export class OccultNecklace extends Necklace {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.OCCULT_NECKLACE;
  }
  get weight(): number {
    return 0.005;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 12,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 5,
        magicDamage: 0.1,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
