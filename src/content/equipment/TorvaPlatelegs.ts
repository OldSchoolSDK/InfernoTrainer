import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Torva_platelegs.png";
import { ItemName } from "../../sdk/ItemName";
import { Legs } from "../../sdk/gear/Legs";
import { Assets } from "../../sdk/utils/Assets";

export class TorvaPlatelegs extends Legs {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.TORVA_PLATELEGS;
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
        magic: -24,
        range: -11,
      },
      defence: {
        stab: 87,
        slash: 78,
        crush: 79,
        magic: -9,
        range: 102,
      },
      other: {
        meleeStrength: 4,
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
    return Assets.getAssetUrl("models/player_sanguine_torva_platelegs.glb");
  }
}
