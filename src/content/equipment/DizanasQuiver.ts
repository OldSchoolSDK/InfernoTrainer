import { ImageLoader } from "../../sdk/utils/ImageLoader";
import InventImage from "../../assets/images/equipment/Dizana's_quiver.png";
import { Cape } from "../../sdk/gear/Cape";
import { ItemName } from "../../sdk/ItemName";
import { Item } from "../../sdk/Item";
import { Equipment, EquipmentTypes } from "../../sdk/Equipment";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { Assets } from "../../sdk/utils/Assets";

export class DizanasQuiver extends Cape {
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  get inventoryImage() {
    return InventImage;
  }
  get itemName(): ItemName {
    return ItemName.DIZANAS_QUIVER;
  }
  get weight(): number {
    return 0.453;
  }

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 18,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 3,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  updateBonuses(gear: Equipment[]): void {
    const weapon = gear.find((item) => item?.type === EquipmentTypes.WEAPON);
    if (!weapon || !(weapon instanceof RangedWeapon)) {
      this.bonuses.other.rangedStrength = 3;
      return;
    }
    if (weapon.compatibleAmmo().includes(ItemName.DRAGON_ARROWS)) {
      this.bonuses.other.rangedStrength = 4;
    } else {
      this.bonuses.other.rangedStrength = 3;
    }
  }

  override get model() {
    return this.Model;
  }
  Model = Assets.getAssetUrl("models/player_dizana_s_max_cape.glb");
}
