import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Legs extends Equipment {

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.legs = this;
  }

  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.legs = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.legs;
  }
}