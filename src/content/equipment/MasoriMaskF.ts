import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Masori_mask_(f).png";
import { Chest } from "../../sdk/gear/Chest";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class MasoriMaskF extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.MASORI_MASK_F;
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
        magic: -1,
        range: 12,
      },
      defence: {
        stab: 8,
        slash: 10,
        crush: 12,
        magic: 12,
        range: 9,
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
  Model = Assets.getAssetUrl("models/player_masori_mask__f_.glb");
}
