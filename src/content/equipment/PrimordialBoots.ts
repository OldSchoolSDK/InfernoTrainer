import { Feet } from "../../sdk/gear/Feet";
import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Primordial_boots.png";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class PrimordialBoots extends Feet {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.PRIMORDIAL_BOOTS;
  }
  get weight(): number {
    return 1.814;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 2,
        slash: 2,
        crush: 2,
        magic: -14,
        range: -1,
      },
      defence: {
        stab: 22,
        slash: 22,
        crush: 22,
        magic: 5,
        range: 5,
      },
      other: {
        meleeStrength: 5,
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

  Model = Assets.getAssetUrl("models/player_primordial_boots.glb");
  override get model() {
    return this.Model;
  }
}
