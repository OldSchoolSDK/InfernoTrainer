import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Cape extends Equipment {
  
  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.cape = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.cape;
  }
}