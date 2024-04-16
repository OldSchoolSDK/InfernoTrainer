import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Barrows_gloves.png";
import { Gloves } from "../../sdk/gear/Gloves";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class BarrowsGloves extends Gloves {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.BARROWS_GLOVES;
  }
  get weight(): number {
    return 0.226;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 12,
        slash: 12,
        crush: 12,
        magic: 6,
        range: 12,
      },
      defence: {
        stab: 12,
        slash: 12,
        crush: 12,
        magic: 6,
        range: 12,
      },
      other: {
        meleeStrength: 12,
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
  
  Model = Assets.getAssetUrl("models/player_barrows_gloves.glb");
  override get model() {
    return this.Model;
  }
}
