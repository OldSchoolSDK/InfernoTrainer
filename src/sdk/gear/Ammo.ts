import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export enum AmmoType {
  BLESSING = 0,
  AMMO = 1, // Temporary, can be broken down later. Only made this enum for the blessing distinction.
}

export class Ammo extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.AMMO;
  }

  ammoType(): AmmoType {
    return AmmoType.AMMO;
  }

  assignToPlayer(player: Player) {
    player.equipment.ammo = this;
  }

  unassignToPlayer(player: Player) {
    player.equipment.ammo = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.ammo;
  }
}
