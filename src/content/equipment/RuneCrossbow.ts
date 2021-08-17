'use strict'

import InventImage from '../../assets/images/equipment/Rune_crossbow.png'
import { Unit, UnitBonuses } from '../../sdk/Unit'
import { RangedWeapon } from '../../sdk/weapons/RangedWeapon'
import { AttackBonuses } from '../../sdk/gear/Weapon'
import { ItemName } from "../../sdk/ItemName"
import { Player } from '../../sdk/Player'
import { AttackStyleTypes, AttackStyle, AttackStylesController } from '../../sdk/AttackStylesController'

export class RuneCrossbow extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 90
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
        rangedStrength: 20,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }

  attackStyles() {
    return [
      AttackStyle.ACCURATE,
      AttackStyle.RAPID,
      AttackStyle.LONGRANGE,
    ]
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.CROSSBOW;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }

  get weight(): number {
    return 6;
  }
  

  get itemName(): ItemName {
    return ItemName.RUNE_CROSSBOW
  }

  get isTwoHander(): boolean {
    return false;
  }

  get attackRange () {
    if (this.attackStyle() === AttackStyle.LONGRANGE){
      return 9;
    }
    return 7
  }

  get attackSpeed () {
    if (this.attackStyle() === AttackStyle.LONGRANGE){
      return 6;
    }
    return 5
  }

  get inventoryImage () {
    return InventImage
  }

  
  rollDamage(from: Unit, to: Unit, bonuses: AttackBonuses) {
    if (from.equipment.ammo && from.equipment.ammo.itemName === ItemName.RUBY_BOLTS_E && Math.random() < 0.066){
      this.damage = to.currentStats.hitpoint * 0.2;
    }else if (from.equipment.ammo && from.equipment.ammo.itemName === ItemName.DIAMOND_BOLTS_E && Math.random() < 0.11){
      this.damage = this._calculateHitDamage(from, to, bonuses);
    }else if (from.equipment.ammo) {
      super.rollDamage(from, to, bonuses);
    }else{
      this.damage = -1;
    }
  }

}
