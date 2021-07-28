import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";

export class Offhand extends Equipment {

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.offhand = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.offhand;
  } 
}