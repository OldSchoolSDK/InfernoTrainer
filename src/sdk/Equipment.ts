import { Item } from "./Item";
import { UnitBonuses, UnitEquipment } from "./Unit";
import { SetEffect } from "./SetEffect"
import { Player } from "./Player";

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
    this.defaultAction = 'Equip';
    this.setStats();
  }

  get hasInventoryLeftClick(): boolean {
    return true;
  }
  inventoryLeftClick(player: Player) {
    const currentItem = this.currentEquipment(player) || null; 
    let openInventorySlots = player.openInventorySlots()
    openInventorySlots.unshift(player.inventory.indexOf(this))
    this.assignToPlayer(player);
    player.inventory[openInventorySlots.shift()] = currentItem;
    player.equipmentChanged()
  }

  get equipmentSetEffect(): typeof SetEffect{
    return null;
  }

  setStats() {
    // throw new Error('stats must be set, none were found')
  }

  currentEquipment(player: Player): Equipment {
    return null;
  }

  assignToPlayer(player: Player) {
    throw new Error('not able to assign to unit equipment')
  }

  unassignToPlayer(player: Player) {
    throw new Error('not able to unassign to unit equipment')
  }

  unequip(player: Player) {
    let openInventorySlots = player.openInventorySlots()
    if (openInventorySlots.length === 0) {
      return;
    }
    this.unassignToPlayer(player)
    
    player.inventory[openInventorySlots.shift()] = this;
  }

  get type(): EquipmentTypes {
    throw new Error('equipment must have a type');
  }

}