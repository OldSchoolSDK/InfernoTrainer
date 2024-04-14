import { Item } from "./Item";
import { UnitBonuses } from "./Unit";
import { SetEffect } from "./SetEffect";
import { Player } from "./Player";

export enum EquipmentTypes {
  HELMET = "helmet",
  CHEST = "chest",
  LEGS = "legs",
  FEET = "feet",
  GLOVES = "gloves",
  WEAPON = "weapon",
  OFFHAND = "offhand",
  AMMO = "ammo",
  BACK = "back",
  NECK = "neck",
  RING = "ring",
}

export class Equipment extends Item {
  bonuses: UnitBonuses;

  constructor() {
    super();
    this.defaultAction = "Equip";
    this.setStats();
  }

  get hasInventoryLeftClick(): boolean {
    return true;
  }

  inventoryLeftClick(player: Player) {
    const currentItem = this.currentEquipment(player) || null;
    const openInventorySlots = player.openInventorySlots();
    openInventorySlots.unshift(player.inventory.indexOf(this));
    this.assignToPlayer(player);
    player.inventory[openInventorySlots.shift()] = currentItem;
    player.equipmentChanged();
  }

  get equipmentSetEffect(): typeof SetEffect {
    return null;
  }

  setStats() {
    // throw new Error('stats must be set, none were found')
  }

  currentEquipment(player: Player): Equipment {
    return null;
  }

  assignToPlayer(player: Player) {
    throw new Error("not able to assign to unit equipment");
  }

  unassignToPlayer(player: Player) {
    throw new Error("not able to unassign to unit equipment");
  }

  unequip(player: Player) {
    const openInventorySlots = player.openInventorySlots();
    if (openInventorySlots.length === 0) {
      return;
    }
    this.unassignToPlayer(player);

    player.inventory[openInventorySlots.shift()] = this;
  }

  get type(): EquipmentTypes {
    throw new Error("equipment must have a type");
  }

  updateBonuses(gear: Item[]) {
    // update bonuses based on other items that have been equipped
  }

  /**
   * name of the model to render for this item
   */
  get model(): string | null {
    return null;
  }

  /**
   * index of animation to use for attacks if possible
   */
  get attackAnimationId(): number | null {
    return null;
  }
}
