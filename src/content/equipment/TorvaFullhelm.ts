import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Torva_full_helm.png";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";
import { Helmet } from "../../sdk/gear/Helmet";

export class TorvaFullhelm extends Helmet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.TORVA_FULL_HELM;
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
        magic: -5,
        range: -5,
      },
      defence: {
        stab: 59,
        slash: 60,
        crush: 62,
        magic: -2,
        range: 57,
      },
      other: {
        meleeStrength: 8,
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
    return Assets.getAssetUrl("models/player_sanguine_torva_full_helm.glb");
  }
}
