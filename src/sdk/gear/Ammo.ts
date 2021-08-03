import { Equipment } from "../Equipment";
import { Player } from "../Player";
import { UnitEquipment } from "../Unit";

export class Ammo extends Equipment {
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