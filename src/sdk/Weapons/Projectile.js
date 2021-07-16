'use strict';
import chebyshev from "chebyshev";
import { Weapon } from "./Weapon";

export class Projectile {

  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor(damage, from, to, attackStyle, forceSWOnly = false, image = null) {
    this.damage = Math.floor(damage);
    if (this.damage > to.currentStats.hitpoint){
      this.damage = to.currentStats.hitpoint;
    }
    this.fromLocation = from.location;
    this.toLocation = to.location;
    // for visual purposes only
    this.fromSize = from.size;
    this.toSize = to.size;
    this.distance = 999999;
    if (image) {
      this.image = new Image();
      this.image.src = image;;
    } else {
      this.image = null;
    }

    if (Weapon.isMeleeAttackStyle(attackStyle)){
      this.distance = 0;
      this.remainingDelay = 0;
      this.initialDelay = 0;
      return;
    }

    if (forceSWOnly){
      // Things like ice barrage calculate distance to SW tile only
      this.distance = chebyshev([this.fromLocation.x, this.fromLocation.y], [this.toLocation.x, this.toLocation.y]);
    } else {
      // Closest tile to target.
      let closestTile = to.getClosestTileTo(this.fromLocation.x, this.fromLocation.y);
      this.distance = chebyshev([this.fromLocation.x, this.fromLocation.y], [closestTile[0], closestTile[1]]);  
    }    
    this.remainingDelay = Math.floor(1 + (3 + this.distance) / 6);
    this.initialDelay = this.remainingDelay;
  }
}
