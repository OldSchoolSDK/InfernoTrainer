import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Masori_body_(f).png";
import { Chest } from "../../sdk/gear/Chest";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class MasoriBodyF extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.MASORI_BODY_F;
  }

  get weight(): number {
    return 10;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -4,
        range: 43,
      },
      defence: {
        stab: 59,
        slash: 52,
        crush: 64,
        magic: 74,
        range: 60,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 4,
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
  Model = Assets.getAssetUrl("models/player_masori_body__f_.glb");
}
