import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Crystal_legs.png";
import { Legs } from "../../sdk/gear/Legs";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class CrystalLegs extends Legs {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.CRYSTAL_LEGS;
  }

  get weight(): number {
    return 1;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: -12,
        range: 18,
      },
      defence: {
        stab: 26,
        slash: 21,
        crush: 30,
        magic: 34,
        range: 38,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 2,
        crystalAccuracy: 0.1,
        crystalDamage: 0.05,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }
  
  Model = Assets.getAssetUrl("models/player_crystal_legs.glb");
  override get model() {
    return this.Model;
  }
}
