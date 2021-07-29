import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";
import { InventoryControls } from "../controlpanels/InventoryControls";

export class Offhand extends Equipment {

  inventoryLeftClick(player: Player) {

    const currentWeapon = player.equipment.weapon || null;
    const currentOffhand = player.equipment.offhand || null;

    let openInventorySlots = InventoryControls.openInventorySlots()
    openInventorySlots.unshift(InventoryControls.inventory.indexOf(this))

    let neededInventorySlots = 0;
    if (currentWeapon && currentWeapon.isTwoHander) {
      neededInventorySlots++;
    }

    if (neededInventorySlots > openInventorySlots.length) {
      return;
    }
    
    this.assignToUnitEquipment(player.equipment);
    if (currentOffhand){
      InventoryControls.inventory[openInventorySlots.shift()] = currentOffhand;
    }else{
      InventoryControls.inventory[openInventorySlots.shift()] = null; 
      openInventorySlots = InventoryControls.openInventorySlots()       
    }
    
    if (currentWeapon && currentWeapon.isTwoHander) {
      InventoryControls.inventory[openInventorySlots.shift()] = currentWeapon;
      player.equipment.weapon = null;
    }

    player.equipmentChanged();
  }
  


  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.offhand = this;
  }
  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.offhand = null;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.offhand;
  } 
}