import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Gloves extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.GLOVES;
  }

  assignToPlayer(player: Player) {
    player.equipment.gloves = this;
  }

  unassignToPlayer(player: Player) {
    player.equipment.gloves = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.gloves;
  }
}
