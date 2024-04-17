import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Feet extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.FEET;
  }

  assignToPlayer(player: Player) {
    player.equipment.feet = this;
  }
  unassignToPlayer(player: Player) {
    player.equipment.feet = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.feet;
  }
}
