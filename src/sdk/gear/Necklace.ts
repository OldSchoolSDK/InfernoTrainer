import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Necklace extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.NECK;
  }

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
