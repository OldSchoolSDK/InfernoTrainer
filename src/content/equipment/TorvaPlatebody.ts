import { Chest } from "../../sdk/gear/Chest";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Torva_platebody.png";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class TorvaPlatebody extends Chest {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.TORVA_PLATEBODY;
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
        magic: -18,
        range: -14,
      },
      defence: {
        stab: 117,
        slash: 111,
        crush: 117,
        magic: -11,
        range: 142,
      },
      other: {
        meleeStrength: 6,
        rangedStrength: 0,
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
    return Assets.getAssetUrl("models/player_sanguine_torva_platebody.glb");
  }
}
