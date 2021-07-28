import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Necklace extends Equipment {

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.necklace = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.necklace;
  }
}