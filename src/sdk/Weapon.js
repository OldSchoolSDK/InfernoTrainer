'use strict';

export class Weapon {

  constructor() {
    this.selected = false;
    this.inventorySprite = new Image();
    this.inventorySprite.src = this.inventoryImage;
  }

  attack(){
    
  }

  static isMeleeAttackStyle(style){
    return style === 'crush' || style === 'slash' || style === 'stab';
  }

  
}
