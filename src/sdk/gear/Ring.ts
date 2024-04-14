import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Ring extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.RING;
  }

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
