'use strict'

import { Item } from "../Item"
import { Region } from "../Region";
import { Unit } from "../Unit";

export class Weapon extends Item{
  selected: boolean;
  inventorySprite: HTMLImageElement;
  
  constructor () {
    super();
    this.selected = false
    this.inventorySprite = new Image()
    this.inventorySprite.src = this.inventoryImage
  }

  cast(region: Region, from: Unit, to: Unit) {

  }

  attack (stage: Region, from: Unit, to: Unit, bonuses: any = {}) {
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
