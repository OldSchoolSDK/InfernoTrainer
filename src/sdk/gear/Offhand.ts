import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";

export class Offhand extends Equipment {
  get type(): EquipmentTypes {
    return EquipmentTypes.OFFHAND;
  }

  inventoryLeftClick(player: Player) {
    const currentWeapon = player.equipment.weapon || null;
    const currentOffhand = player.equipment.offhand || null;

    let openInventorySlots = player.openInventorySlots();
    openInventorySlots.unshift(player.inventory.indexOf(this));

    let neededInventorySlots = 0;
    if (currentWeapon && currentWeapon.isTwoHander) {
      neededInventorySlots++;
    }

    if (neededInventorySlots > openInventorySlots.length) {
      return;
    }

    this.assignToPlayer(player);
    if (currentOffhand) {
      player.inventory[openInventorySlots.shift()] = currentOffhand;
    } else {
      player.inventory[openInventorySlots.shift()] = null;
      openInventorySlots = player.openInventorySlots();
    }

    if (currentWeapon && currentWeapon.isTwoHander) {
      player.inventory[openInventorySlots.shift()] = currentWeapon;
      player.equipment.weapon = null;
    }

    player.equipmentChanged();
  }

  assignToPlayer(player: Player) {
    player.equipment.offhand = this;
  }
  unassignToPlayer(player: Player) {
    player.equipment.offhand = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.offhand;
  }
}
