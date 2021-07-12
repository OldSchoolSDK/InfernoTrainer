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

  static isMeleeAttackStyle(style){
    return style === 'crush' || style === 'slash' || style === 'stab';
  }

  
}
