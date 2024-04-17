import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Chest extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.CHEST;
  }
  assignToPlayer(player: Player) {
    player.equipment.chest = this;
  }

  unassignToPlayer(player: Player) {
    player.equipment.chest = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.chest;
  }
}
