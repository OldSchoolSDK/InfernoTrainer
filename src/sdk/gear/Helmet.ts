import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Helmet extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.HELMET;
  }

  assignToPlayer(player: Player) {
    player.equipment.helmet = this;
  }
  unassignToPlayer(player: Player) {
    player.equipment.helmet = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.helmet;
  }
}
