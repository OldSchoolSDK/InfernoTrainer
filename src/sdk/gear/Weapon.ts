"use strict";

import { BasePrayer } from "../BasePrayer";
import { Unit } from "../Unit";
import { ImageLoader } from "../utils/ImageLoader";
import { Equipment } from "../Equipment";
import { Player } from "../Player";
import { Projectile, ProjectileOptions } from "../weapons/Projectile";
import { find } from "lodash";
import { SetEffect, SetEffectTypes } from "../SetEffect";
import { ItemName } from "../ItemName";
import { AttackStylesController, AttackStyle, AttackStyleTypes } from "../AttackStylesController";
import { Random } from "../Random";
import { Sound, SoundCache } from "../utils/SoundCache";

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
  gearMeleeMultiplier?: number;
  gearMageMultiplier?: number;
  gearRangeMultiplier?: number;
  attackStyle?: string;
  magicBaseSpellDamage?: number;
  overallMultiplier?: number;
  effectivePrayers?: EffectivePrayers;
  isSpecialAttack?: boolean;
}

export class Weapon extends Equipment {
  damage: number;
  damageRoll: number;
  lastHitHit = false;
  override selected = false;
  override inventorySprite: HTMLImageElement = ImageLoader.createImage(this.inventoryImage);

  attackStyles() {
    return [];
  }

  compatibleAmmo(): ItemName[] {
    return [];
  }

  attackStyleCategory(): AttackStyleTypes {
    return null;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }

  attackStyle() {
    return AttackStylesController.controller.getAttackStyleForType(this.attackStyleCategory(), this);
  }

  override assignToPlayer(player: Player) {
    player.equipment.weapon = this;
    player.interruptCombat();
  }

  override unassignToPlayer(player: Player) {
    player.equipment.weapon = null;
  }
  override currentEquipment(player: Player): Equipment {
    return player.equipment.weapon;
  }

  hasSpecialAttack(): boolean {
    return false;
  }
  specialAttackDrain(): number {
    return 50;
  }
  specialAttack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    // Override me
    if (this.specialAttackSound) {
      SoundCache.play(this.specialAttackSound);
    }
  }

  override inventoryLeftClick(player: Player) {
    const currentWeapon = player.equipment.weapon || null;
    const currentOffhand = player.equipment.offhand || null;

    let openInventorySlots = player.openInventorySlots();
    openInventorySlots.unshift(player.inventory.indexOf(this));

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
    this.assignToPlayer(player);
    if (currentWeapon) {
      player.inventory[openInventorySlots.shift()] = currentWeapon;
    } else {
      player.inventory[openInventorySlots.shift()] = null;
      openInventorySlots = player.openInventorySlots();
    }
    if (this.isTwoHander && currentOffhand) {
      player.inventory[openInventorySlots.shift()] = currentOffhand;
      player.equipment.offhand = null;
    }
    player.equipmentChanged();
  }

  cast(from: Unit, to: Unit) {
    // Override me
  }

  rollDamage(from: Unit, to: Unit, bonuses: AttackBonuses) {
    this.damageRoll = Math.floor(this._rollAttack(from, to, bonuses));
    this.damage = Math.min(this.damageRoll, to.currentStats.hitpoint);
  }

  calculateHitDelay(distance: number) {
    return 999;
  }

  // Return value: If the attack was performed or not. If the attack was not performed, do not reset timers.
  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    this._calculatePrayerEffects(from, to, bonuses);
    bonuses.styleBonus = bonuses.styleBonus || 0;
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1;
    bonuses.gearMeleeMultiplier = bonuses.gearMeleeMultiplier || 1;
    bonuses.gearMageMultiplier = bonuses.gearMageMultiplier || 1;
    bonuses.gearRangeMultiplier = bonuses.gearRangeMultiplier || 1;
    bonuses.overallMultiplier = bonuses.overallMultiplier || 1.0;

    this.rollDamage(from, to, bonuses);

    if (this.damage === -1) {
      return false;
    }

    if (to.setEffects) {
      find(to.setEffects, (effect: typeof SetEffect) => {
        if (effect.effectName() === SetEffectTypes.JUSTICIAR) {
          const tosDefenceBonus = to.bonuses.defence[bonuses.attackStyle];
          if (tosDefenceBonus !== undefined) {
            // hack?
            const justiciarDamageReduction = Math.max(tosDefenceBonus / 3000, 0);
            this.damage -= Math.ceil(justiciarDamageReduction * this.damage);
          }
        }
      });
    }

    // Protection prayers
    if (this.isBlockable(from, to, bonuses)) {
      this.damage = 0;
    }

    // sanitize damage output
    this.damage = Math.floor(Math.max(Math.min(to.currentStats.hitpoint, this.damage, 100), 0));

    if (to.equipment.ring && to.equipment.ring.itemName === ItemName.RING_OF_SUFFERING_I && this.damage > 0) {
      from.addProjectile(
        new Projectile(this, Math.floor(this.damage * 0.1) + 1, to, from, "recoil", { reduceDelay: 15, hidden: true }),
      );
    }

    this.grantXp(from);
    this.registerProjectile(from, to, bonuses);
    return true;
  }

  _rollAttack(from: Unit, to: Unit, bonuses: AttackBonuses) {
    this.lastHitHit = false;
    return Random.get() > this._hitChance(from, to, bonuses) ? 0 : this._calculateHitDamage(from, to, bonuses);
  }

  _calculateHitDamage(from: Unit, to: Unit, bonuses: AttackBonuses) {
    this.lastHitHit = true;
    return Math.floor(Random.get() * (this._maxHit(from, to, bonuses) + 1));
  }

  _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }
  _defenceRoll(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }
  _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return 0; // weapons implement this at the type tier
  }

  _hitChance(from: Unit, to: Unit, bonuses: AttackBonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses);
    const defenceRoll = this._defenceRoll(from, to, bonuses);
    const hitChance =
      attackRoll > defenceRoll ? 1 - (defenceRoll + 2) / (2 * attackRoll + 1) : attackRoll / (2 * defenceRoll + 1);
    return hitChance;
  }

  isBlockable(from: Unit, to: Unit, bonuses: AttackBonuses): boolean {
    return false; // weapons implement this at the type tier
  }

  grantXp(from: Unit) {
    // weapons implement this at the type tier
  }

  _calculatePrayerEffects(from: Unit, to: Unit, bonuses: AttackBonuses) {
    // weapons implement this at the type tier
  }

  registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses, options: ProjectileOptions = {}) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, bonuses.attackStyle, {
        sound: this.attackSound,
        hitSound: this.attackLandingSound,
        ...options,
      }),
    );
  }

  get image(): HTMLImageElement {
    return null;
  }

  get attackRange(): number {
    return 0;
  }

  get attackSpeed(): number {
    return 10;
  }

  get aoe() {
    return [{ x: 0, y: 0 }];
  }

  // Returns true if this attack is an area-based attack that doesn't require line of sight to
  // the target (including if the target is underneath).
  get isAreaAttack() {
    return false;
  }

  // Returns true if this attack is a melee attack (and therefore cannot attack on corners).
  get isMeleeAttack() {
    return false;
  }

  get isTwoHander(): boolean {
    return false;
  }

  static isMeleeAttackStyle(style: string) {
    return style === "crush" || style === "slash" || style === "stab";
  }

  get attackSound(): Sound | null {
    // Override me
    return null;
  }

  get specialAttackSound(): Sound | null {
    return null;
  }

  get attackLandingSound(): Sound | null {
    return null;
  }
}
