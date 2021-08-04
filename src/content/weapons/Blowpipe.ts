'use strict'

import BPInventImage from '../../assets/images/weapons/blowpipe.png'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { ItemName } from "../../sdk/ItemName";
import { World } from '../../sdk/World';
import { Unit } from '../../sdk/Unit';
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { SetEffect, SetEffectTypes } from '../../sdk/SetEffect';
import { find } from 'lodash';

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


  specialAttack(world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    
    bonuses.isSpecialAttack = true;
    super.attack(world, from, to, bonuses)
    
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

  get attackRange () {
    return 5
  }

  get attackSpeed () {
    return 2
  }

  get inventoryImage () {
    return BPInventImage
  }

}
