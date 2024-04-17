import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Ancestral_robe_bottom.png";
import { Legs } from "../../sdk/gear/Legs";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class AncestralRobebottom extends Legs {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.ANCESTRAL_ROBEBOTTOM;
  }

  get weight(): number {
    return 1.814;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 26,
        range: -7,
      },
      defence: {
        stab: 27,
        slash: 24,
        crush: 30,
        magic: 20,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0.02,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
  
  Model = Assets.getAssetUrl("models/player_ancestral_robe_bottom.glb");
  override get model() {
    return this.Model;
  }
}
