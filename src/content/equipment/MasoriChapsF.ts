import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Masori_chaps_(f).png";
import { Legs } from "../../sdk/gear/Legs";
import { ItemName } from "../../sdk/ItemName";

import { Assets } from "../../sdk/utils/Assets";

export class MasoriChapsF extends Legs {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.MASORI_CHAPS_F;
  }

  get weight(): number {
    return 1;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -2,
        range: 27,
      },
      defence: {
        stab: 35,
        slash: 30,
        crush: 39,
        magic: 46,
        range: 37,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 2,
        magicDamage: 0,
        prayer: 1,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  override get model() {
    return this.Model;
  }
  Model = Assets.getAssetUrl("models/player_masori_chaps__f_.glb");
}
