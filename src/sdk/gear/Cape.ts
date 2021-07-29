import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Cape extends Equipment {
  
  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.cape = this;
  }
  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.cape = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.cape;
  }
}