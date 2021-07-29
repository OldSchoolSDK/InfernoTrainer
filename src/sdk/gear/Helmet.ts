
import { Equipment, EquipmentTypes } from '../Equipment';
import { UnitEquipment } from '../Unit';
import { Player } from "../Player";

export class Helmet extends Equipment {
  
  get type(): EquipmentTypes {
    return EquipmentTypes.HELMET;
  }

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.helmet = this;
  }
  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.helmet = null;
  }


  currentEquipment(player: Player): Equipment {
    return player.equipment.helmet;
  }
}