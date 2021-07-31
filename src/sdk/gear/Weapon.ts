'use strict'

import { GameObject } from "../GameObject";
import { BasePrayer } from "../BasePrayer";
import { World } from "../World";
import { Unit, UnitEquipment } from "../Unit";
import { ImageLoader } from "../utils/ImageLoader";
import { Equipment } from '../Equipment'
import { Player } from "../Player";
import { InventoryControls } from "../controlpanels/InventoryControls";
import { Projectile } from "../weapons/Projectile";
import { find } from "lodash";
import { SetEffect, SetEffectTypes } from "../SetEffect";

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
  isSpecialAttack?: boolean;
}

export class Weapon extends Equipment{
  damage: number;
  selected: boolean = false;
  inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage)

  assignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.weapon = this;
  }

  unassignToUnitEquipment(unitEquipment: UnitEquipment) {
    unitEquipment.weapon = null;
  }
  currentEquipment(player: Player): Equipment {
    return player.equipment.weapon;
  }

  hasSpecialAttack(): boolean {
    return false;
  }
  specialAttackDrain(): number {
    return 50;
  }
  specialAttack(world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
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
    player.equipmentChanged();
  }
  
  
  cast(world: World, from: Unit, to: GameObject) {

  }


  attack(world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    this._calculatePrayerEffects(from, to, bonuses)
    bonuses.styleBonus = bonuses.styleBonus || 0
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1
    bonuses.overallMultiplier = bonuses.overallMultiplier || 1.0

    this.damage = Math.floor(Math.min(this._rollAttack(from, to, bonuses), to.currentStats.hitpoint))
    if (this.isBlockable(from, to, bonuses)) {
      this.damage = 0
    }
    if (to.setEffects) {
      find(to.setEffects, (effect: typeof SetEffect) => {
        if (effect.effectName() === SetEffectTypes.JUSTICIAR){
          const tosDefenceBonus = to.bonuses.defence[bonuses.attackStyle];
          if (tosDefenceBonus !== undefined) { // hack?
            const justiciarDamageReduction = Math.max(tosDefenceBonus / 3000, 0);
            this.damage -= Math.ceil(justiciarDamageReduction * this.damage);
          }
        }
      })
    }

    // sanitize damage output
    this.damage = Math.floor(Math.max(Math.min(to.currentStats.hitpoint, this.damage), 0));

    this.grantXp(from);
    this.registerProjectile(from, to, bonuses)
  }
  
  _rollAttack (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses))
  }

  _attackRoll (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }
  _defenceRoll (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }
  _maxHit (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }

  _hitChance (from: Unit, to: Unit, bonuses: AttackBonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses)
    const defenceRoll = this._defenceRoll(from, to, bonuses)
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }

  isBlockable (from: Unit, to: GameObject, bonuses: AttackBonuses): boolean {
    return false; // weapons implement this at the type tier
  }

  grantXp(from: Unit) {
    // weapons implement this at the type tier
  }
  
  _calculatePrayerEffects (from: Unit, to: Unit, bonuses: AttackBonuses) {
    // weapons implement this at the type tier
  }

  registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses) {
    to.addProjectile(new Projectile(this, this.damage, from, to, bonuses.attackStyle))
  }

  get image(): string {
    return null;
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

  get isTwoHander(): boolean {
    return false;
  }
  
  static isMeleeAttackStyle (style: string) {
    return style === 'crush' || style === 'slash' || style === 'stab'
  }
}
