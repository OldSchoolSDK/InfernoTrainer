import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Feet extends Equipment {
  
  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.feet = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.feet;
  }
}