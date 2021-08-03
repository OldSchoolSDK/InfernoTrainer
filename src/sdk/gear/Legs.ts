import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Legs extends Equipment {

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