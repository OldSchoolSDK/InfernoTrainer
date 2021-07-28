'use strict'

import { GameObject } from "../GameObject";
import { BasePrayer } from "../BasePrayer";
import { World } from "../World";
import { Unit, UnitEquipment } from "../Unit";
import { ImageLoader } from "../utils/ImageLoader";
import { Equipment } from '../Equipment'
import { Player } from "../Player";
import { InventoryControls } from "../controlpanels/InventoryControls";

interface EffectivePrayers {
  magic?: BasePrayer;
  range?: BasePrayer;
  attack?: BasePrayer;
  strength?: BasePrayer;
  defence?: BasePrayer;
  overhead?: BasePrayer;
}

export interface AttackBonuses {
  styleBonus?: number;
  isAccurate?: boolean;
  voidMultiplier?: number;
  gearMultiplier?: number;
  attackStyle?: string;
  magicBaseSpellDamage?: number;
  overallMultiplier?: number;
  effectivePrayers?: EffectivePrayers;
}

export class Weapon extends Equipment{
  selected: boolean = false;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.weapon = this;
  }

  currentEquipment(player: Player): Equipment {
    return player.equipment.weapon;
  }

  hasSpecialAttack(): boolean {
    return false;
  }

  get isTwoHander(): boolean {
    return false;
  }


  inventoryLeftClick(player: Player) {
    const currentWeapon = player.equipment.weapon || null;
    const currentOffhand = player.equipment.offhand || null;

    let openInventorySlots = InventoryControls.openInventorySlots()
    openInventorySlots.unshift(InventoryControls.inventory.indexOf(this))

    let neededInventorySlots = 0;
    if (this.isTwoHander && currentWeapon) {
      neededInventorySlots++;
    }
    if (this.isTwoHander && currentOffhand) {
      neededInventorySlots++;
    }
    if (currentWeapon) {
      neededInventorySlots--;
    }

    if (neededInventorySlots > openInventorySlots.length) {
      return;
    }
    this.assignToUnitEquipment(player.equipment);
    if (currentWeapon) {
      InventoryControls.inventory[openInventorySlots.shift()] = currentWeapon;
    }else{
      InventoryControls.inventory[openInventorySlots.shift()] = null; 
      openInventorySlots = InventoryControls.openInventorySlots()       
    }
    if (this.isTwoHander && currentOffhand) {
      InventoryControls.inventory[openInventorySlots.shift()] = currentOffhand;
      player.equipment.offhand = null;
    }
  }
  
  
  cast(world: World, from: Unit, to: GameObject) {

  }

  attack (stage: World, from: Unit, to: GameObject, bonuses: AttackBonuses = {}) {
  }
  
  isBlockable (from: Unit, to: GameObject, bonuses: AttackBonuses): boolean {
    return false;
  }

  get image(): string {
    return '';
  }

  get attackRange(): number {
    return 0
  }
  
  get attackSpeed(): number {
    return 10
  }

  get aoe () {
    return [
      { x: 0, y: 0 }
    ]
  }

  // Returns true if this attack is an area-based attack that doesn't require line of sight to
  // the target (including if the target is underneath).
  get isAreaAttack () {
    return false
  }

  // Returns true if this attack is a melee attack (and therefore cannot attack on corners).
  get isMeleeAttack () {
    return false
  }

  static isMeleeAttackStyle (style: string) {
    return style === 'crush' || style === 'slash' || style === 'stab'
  }
}
