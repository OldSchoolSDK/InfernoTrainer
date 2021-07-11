'use strict';
import chebyshev from "chebyshev";

export default class Projectile {
  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor(damage, from, to, attackStyle) {
    this.damage = damage;
    this.fromLocation = from.location;
    this.toLocation = to.location;
    this.distance = 999999;

    if (attackStyle === 'melee'){
      this.distance = 0;
      this.delay = 0;
      return;
    }

    for (let yy = 0; yy < to.size; yy++){
      for (let xx = 0; xx < to.size; xx++){
        this.distance = Math.min(this.distance, chebyshev([this.fromLocation.x, this.fromLocation.y], [this.toLocation.x + xx, this.toLocation.y - yy]));
      }  
    }
    
    this.delay = Math.floor(1 + (3 + this.distance) / 6);
  }
}
