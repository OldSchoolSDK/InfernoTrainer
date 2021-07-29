import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Chest extends Equipment {
  
  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.chest = this;
  }

  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.chest = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.chest;
  }
}