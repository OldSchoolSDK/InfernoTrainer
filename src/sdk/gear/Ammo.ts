import { Equipment } from "../Equipment";
import { Player } from "../Player";
import { UnitEquipment } from "../Unit";

export class Ammo extends Equipment {
  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.ammo = this;
  }

  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.ammo = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.ammo;
  }
}