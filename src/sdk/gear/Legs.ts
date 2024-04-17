import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Legs extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.LEGS;
  }

  assignToPlayer(player: Player) {
    player.equipment.legs = this;
  }

  unassignToPlayer(player: Player) {
    player.equipment.legs = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.legs;
  }
}
