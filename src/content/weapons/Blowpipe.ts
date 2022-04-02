'use strict'

import BPInventImage from '../../assets/images/weapons/blowpipe.png'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { ItemName } from "../../sdk/ItemName";
import { World } from '../../sdk/World';
import { Unit } from '../../sdk/Unit';
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { AttackStyle, AttackStyleTypes } from '../../sdk/AttackStylesController';

export class Blowpipe extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 30
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 20 + 35,  // simulating dragon darts atm
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }


  calculateHitDelay(distance: number) {
    return Math.floor(distance / 6) + 1;
  }


  attackStyles() {
    return [
      AttackStyle.ACCURATE,
      AttackStyle.RAPID,
      AttackStyle.LONGRANGE,
    ]
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.THROWN;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }

  get attackRange () {
    if (this.attackStyle() === AttackStyle.LONGRANGE){
      return 7;
    }
    return 5
  }

  get attackSpeed () {
    if (this.attackStyle() === AttackStyle.LONGRANGE){
      return 3;
    }
    return 2
  }
  
  
  get weight(): number {
    return 0.5
  }

  specialAttack(from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    
    bonuses.isSpecialAttack = true;
    super.attack(from, to, bonuses)
    
    const healAttackerBy = Math.floor(this.damage / 2);
    from.currentStats.hitpoint += healAttackerBy;
    from.currentStats.hitpoint = Math.min(from.currentStats.hitpoint, from.stats.hitpoint);
  }

  _damageMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    if (bonuses.isSpecialAttack) {
      return 1.5;
    }
    return 1;
  }
  _accuracyMultiplier (from: Unit, to: Unit, bonuses: AttackBonuses) {
    if (bonuses.isSpecialAttack) {
      return 2;
    }
    return 1;
  }

  get itemName(): ItemName {
    return ItemName.TOXIC_BLOWPIPE
  }
  
  get isTwoHander(): boolean {
    return true;
  }
  
  hasSpecialAttack(): boolean {
    return true;
  }
  get inventoryImage () {
    return BPInventImage
  }

}
