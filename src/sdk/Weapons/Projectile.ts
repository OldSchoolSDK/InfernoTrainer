'use strict'


import chebyshev from 'chebyshev'
import { GameObject, Location } from '../GameObject'
import { Unit } from '../Unit'
import { Weapon } from './Weapon'

export interface ProjectileOptions {
  forceSWTile?: boolean;
}

export class Projectile {

  weapon: Weapon;
  damage: number;
  from: Unit;
  to: Unit;
  distance: number;
  remainingDelay: number;
  initialDelay: number;
  currentLocation: Location;

  offsetX: number;
  offsetY: number;
  image: HTMLImageElement;

  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor (weapon: Weapon, damage: number, from: Unit, to: Unit, attackStyle: string, options: ProjectileOptions = {}) {
    this.damage = Math.floor(damage)
    if (this.damage > to.currentStats.hitpoint) {
      this.damage = to.currentStats.hitpoint
    }
    this.currentLocation = {
      x: from.location.x + from.size / 2,
      y: from.location.y - from.size / 2 + 1
    }
    this.from = from
    this.to = to
    this.distance = 999999

    if (Weapon.isMeleeAttackStyle(attackStyle)) {
      this.distance = 0
      this.remainingDelay = 0
      this.initialDelay = 0;
      return
    }

    if (weapon.image){
      const image = new Image();
      image.src = weapon.image;
      image.onload = () => {
        this.image = image;
      }
    }

    if (options.forceSWTile) {
      // Things like ice barrage calculate distance to SW tile only
      this.distance = chebyshev([this.from.location.x, this.from.location.y], [this.to.location.x, this.to.location.y])
    } else {
      let closestTile = to.getClosestTileTo(this.from.location.x, this.from.location.y);
      this.distance = chebyshev([this.from.location.x, this.from.location.y], [closestTile[0], closestTile[1]]);  
    }
    
    this.remainingDelay = Math.floor(1 + (3 + this.distance) / 6)
    this.initialDelay = this.remainingDelay;

  }
}
