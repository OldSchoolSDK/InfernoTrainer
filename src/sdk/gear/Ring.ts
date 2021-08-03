import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Ring extends Equipment {

  assignToPlayer(player: Player) {
    player.equipment.ring = this;
  }
  unassignToPlayer(player: Player) {
    player.equipment.ring = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.ring;
  }
}