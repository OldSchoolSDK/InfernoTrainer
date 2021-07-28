import { Equipment } from "../Equipment";
import { UnitEquipment } from "../Unit";
import { Player } from "../Player";
import { InventoryControls } from "../controlpanels/InventoryControls";

export class Offhand extends Equipment {

  // inventoryLeftClick(player: Player) {
  //   // player.bonuses = clickedItem.bonuses // temp code
  //   const currentWeapon = player.equipment.weapon || null;
  //   const currentOffhand = player.equipment.offhand || null;

  //   const numberOfOpenInventorySpots = InventoryControls.numberOfOpenInventorySpots()
  //   const openInventorySpot = InventoryControls.openInventorySlots();

  //   if (currentWeapon && currentWeapon.isTwoHander && numberOfOpenInventorySpots === 0) {
  //     console.log('cant equip (2)')
  //     return;
  //   }

  //   if (!currentWeapon || (currentWeapon && openInventorySpot !== -1)) {
  //     this.assignToUnitEquipment(player.equipment);
  //     InventoryControls.inventory[openInventorySpot] = currentWeapon;
  //   }
  // }


  inventoryLeftClick(player: Player) {
    // player.bonuses = clickedItem.bonuses // temp code
    const currentWeapon = player.equipment.weapon || null;
    const currentOffhand = player.equipment.offhand || null;

    let openInventorySlots = InventoryControls.openInventorySlots()
    openInventorySlots.unshift(InventoryControls.inventory.indexOf(this))

    let neededInventorySlots = 0;
    if (currentWeapon && currentWeapon.isTwoHander) {
      neededInventorySlots++;
    }

    if (neededInventorySlots <= openInventorySlots.length) {
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
    }
  }
  


  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.offhand = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.offhand;
  } 
}