import { Item } from "./Item";
import { UnitBonuses, UnitEquipment } from "./Unit";
import { SetEffect } from "./SetEffect"
import { Player } from "./Player";
import { InventoryControls } from "./controlpanels/InventoryControls";

export enum EquipmentTypes {
  HELMET ='helmet',
  CHEST = 'chest',
  LEGS = 'legs',
  FEET = 'feet',
  GLOVES = 'gloves',
  WEAPON = 'weapon',
  OFFHAND = 'offhand',
  AMMO = 'ammo',
  BACK = 'back'
}


export class Equipment extends Item {
  bonuses: UnitBonuses;

  constructor() {
    super()
    this.setStats();
  }

  get hasLeftClick(): boolean {
    return true;
  }

  leftClick(player: Player) {
    player.aggro = null
    // player.bonuses = clickedItem.bonuses // temp code
 
    const currentItem = this.currentEquipment(player) || null;    
    this.assignToUnitEquipment(player.equipment);
    InventoryControls.inventory[this.inventoryPosition] = currentItem;

  }


  equipmentSetEffect(): SetEffect{
    return null;
  }

  setStats() {
    // throw new Error('stats must be set, none were found')
  }

  currentEquipment(player: Player): Equipment {
    return null;
  }

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    throw new Error('not able to assign to unit equipment')
  }

  get type(): EquipmentTypes {
    throw new Error('equipment must have a type');
  }

}