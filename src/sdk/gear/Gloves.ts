import { Equipment } from "../Equipment";
import { Player } from "../Player";

export class Gloves extends Equipment {
  
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