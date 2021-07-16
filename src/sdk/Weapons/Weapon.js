'use strict';

export class Weapon {

  constructor() {
    this.selected = false;
    this.inventorySprite = new Image();
    this.inventorySprite.src = this.inventoryImage;
  }

  attack(){
    
  }

  get aoe() {
    return [
      {x: 0, y: 0}
    ];
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

  // Returns the projectile image for this weapon.
  get image() {
    return null;
  }

  static isMeleeAttackStyle(style){
    return style === 'crush' || style === 'slash' || style === 'stab';
  }
}
