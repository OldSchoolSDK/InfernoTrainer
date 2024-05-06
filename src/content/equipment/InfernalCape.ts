import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Infernal_cape.png";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";
import { Cape } from "../../sdk/gear/Cape";

export class InfernalCape extends Cape {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.INFERNAL_CAPE;
  }
  get weight(): number {
    return 1.814;
  }

  get inventoryImage() {
    return InventImage;
  }
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 4,
        slash: 4,
        crush: 4,
        magic: 1,
        range: 1,
      },
      defence: {
        stab: 12,
        slash: 12,
        crush: 12,
        magic: 12,
        range: 12,
      },
      other: {
        meleeStrength: 8,
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

  override get model() {
    return Assets.getAssetUrl("models/player_infernal_cape.glb");
  }
}
