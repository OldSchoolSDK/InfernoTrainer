import { Chest } from "../../sdk/gear/Chest";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Justiciar_chestguard.png";
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";
import { ItemName } from "../../sdk/ItemName";

export class JusticiarChestguard extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get equipmentSetEffect(): typeof SetEffect {
    return JusticiarSetEffect;
  }
  get itemName(): ItemName {
    return ItemName.JUSTICIAR_CHESTGUARD;
  }
  get weight(): number {
    return 9.979;
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
        magic: -40,
        range: -20,
      },
      defence: {
        stab: 132,
        slash: 130,
        crush: 117,
        magic: -16,
        range: 142,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 4,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
