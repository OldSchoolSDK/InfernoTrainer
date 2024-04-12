import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Rune_kiteshield.png";
import { Offhand } from "../../sdk/gear/Offhand";
import { ItemName } from "../../sdk/ItemName";

export class RuneKiteshield extends Offhand {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.RUNE_KITESHIELD;
  }
  get weight(): number {
    return 5.443;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -8,
        range: -3,
      },
      defence: {
        stab: 44,
        slash: 48,
        crush: 46,
        magic: -1,
        range: 46,
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
