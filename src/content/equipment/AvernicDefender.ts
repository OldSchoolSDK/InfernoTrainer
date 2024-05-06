import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Avernic_defender.png";
import { Offhand } from "../../sdk/gear/Offhand";
import { ItemName } from "../../sdk/ItemName";
import { Assets } from "../../sdk/utils/Assets";

export class AvernicDefender extends Offhand {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.AVERNIC_DEFENDER;
  }
  get weight(): number {
    return 0.453;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 30,
        slash: 29,
        crush: 28,
        magic: -5,
        range: -4,
      },
      defence: {
        stab: 30,
        slash: 29,
        crush: 28,
        magic: -5,
        range: -4,
      },
      other: {
        meleeStrength: 8,
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

  Model = Assets.getAssetUrl("models/player_avernic_defender.glb");
  override get model() {
    return this.Model;
  }
}
