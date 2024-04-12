import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Armadyl_chestplate.png";
import { Chest } from "../../sdk/gear/Chest";
import { ItemName } from "../../sdk/ItemName";

export class ArmadylChestplate extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.ARMADYL_CHESTPLATE;
  }

  get weight(): number {
    return 4;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: -7,
        slash: -7,
        crush: -7,
        magic: -15,
        range: 33,
      },
      defence: {
        stab: 56,
        slash: 48,
        crush: 61,
        magic: 70,
        range: 57,
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
