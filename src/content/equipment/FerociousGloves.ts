import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Ferocious_gloves.png";
import { Gloves } from "../../sdk/gear/Gloves";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class FerociousGloves extends Gloves {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.FEROCIOUS_GLOVES;
  }
  get weight(): number {
    return 0.226;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 16,
        slash: 16,
        crush: 16,
        magic: -16,
        range: -16,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 6,
        range: 0,
      },
      other: {
        meleeStrength: 14,
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

  Model = Assets.getAssetUrl("models/player_ferocious_gloves.glb");
  override get model() {
    return this.Model;
  }
}
