import { Equipment } from "../Equipment";
import { Player } from "../Player";

export class Feet extends Equipment {
  
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