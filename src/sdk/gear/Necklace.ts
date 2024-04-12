import { Equipment } from "../Equipment";
import { Player } from "../Player";

export class Necklace extends Equipment {
  assignToPlayer(player: Player) {
    player.equipment.necklace = this;
  }

  unassignToPlayer(player: Player) {
    player.equipment.necklace = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.necklace;
  }
}
