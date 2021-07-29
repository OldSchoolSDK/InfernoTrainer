import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Ring extends Equipment {

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.ring = this;
  }
  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.ring = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.ring;
  }
}