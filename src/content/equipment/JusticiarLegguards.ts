import { Legs } from "../../sdk/gear/Legs";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Justiciar_legguards.png";
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";
import { ItemName } from "../../sdk/ItemName";

export class JusticiarLegguards extends Legs {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get equipmentSetEffect(): typeof SetEffect {
    return JusticiarSetEffect;
  }
  get itemName(): ItemName {
    return ItemName.JUSTICIAR_LEGGUARDS;
  }
  get weight(): number {
    return 9.071;
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
        magic: -31,
        range: -17,
      },
      defence: {
        stab: 95,
        slash: 92,
        crush: 93,
        magic: -14,
        range: 102,
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
