import { Helmet } from "../../sdk/gear/Helmet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Justiciar_faceguard.png";
import { SetEffect } from "../../sdk/SetEffect";
import { JusticiarSetEffect } from "../seteffects/JusticiarSetEffect";
import { ItemName } from "../../sdk/ItemName";

export class JusticiarFaceguard extends Helmet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get equipmentSetEffect(): typeof SetEffect {
    return JusticiarSetEffect;
  }
  get itemName(): ItemName {
    return ItemName.JUSTICIAR_FACEGUARD;
  }
  get weight(): number {
    return 2.721;
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
        magic: -6,
        range: -2,
      },
      defence: {
        stab: 60,
        slash: 63,
        crush: 59,
        magic: -6,
        range: 67,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 2,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
}
