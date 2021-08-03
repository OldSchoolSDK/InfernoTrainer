import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Chest extends Equipment {
  
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