import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Dragon_arrow_5.png";
import { Ammo } from "../../sdk/gear/Ammo";
import { ItemName } from "../../sdk/ItemName";

export class DragonArrows extends Ammo {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get weight(): number {
    return 0;
  }

  get itemName(): ItemName {
    return ItemName.DRAGON_ARROWS;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
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
        rangedStrength: 60,
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
