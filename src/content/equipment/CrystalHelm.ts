import { Helmet } from "../../sdk/gear/Helmet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Crystal_helm.png";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class CrystalHelm extends Helmet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get itemName(): ItemName {
    return ItemName.CRYSTAL_HELM;
  }
  get weight(): number {
    return 0.5;
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
        magic: -10,
        range: 9,
      },
      defence: {
        stab: 12,
        slash: 8,
        crush: 14,
        magic: 10,
        range: 18,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 2,
        crystalAccuracy: 0.05,
        crystalDamage: 0.025,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
  
  Model = Assets.getAssetUrl("models/player_crystal_helm.glb");
  override get model() {
    return this.Model;
  }
}
