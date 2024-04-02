'use strict'


import chebyshev from 'chebyshev'
import { Location } from "../Location"
import { Unit } from '../Unit'
import { Weapon } from '../gear/Weapon'
import { Sound, SoundCache } from '../utils/SoundCache'

export interface ProjectileOptions {
  forceSWTile?: boolean;
  hidden?: boolean;
  reduceDelay?: number;
  cancelOnDeath?: boolean;
}

export class Projectile {
  weapon: Weapon;
  damage: number;
  from: Unit;
  to: Unit;
  distance: number;
  options: ProjectileOptions = {};
  remainingDelay: number;
  currentLocation: Location;
  currentHeight: number;
  attackStyle: string;

  offsetX: number;
  offsetY: number;
  image: HTMLImageElement;

  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor (weapon: Weapon, damage: number, from: Unit, to: Unit, attackStyle: string, options: ProjectileOptions = {}, sound: Sound | null = null) {

    this.attackStyle = attackStyle;
    this.damage = Math.floor(damage)
    if (this.damage > to.currentStats.hitpoint) {
      this.damage = to.currentStats.hitpoint
    }
    this.options = options;

    this.currentLocation = {
      x: from.location.x + from.size / 2,
      y: from.location.y - from.size / 2 + 1
    }
    this.currentHeight = from.height * 0.75; // projectile origin
    this.from = from
    this.to = to
    this.distance = 999999

    if (Weapon.isMeleeAttackStyle(attackStyle)) {
      this.distance = 0
      this.remainingDelay = 1
      return
    }

    if (weapon.image){
      this.image = weapon.image
    }

    if (options.forceSWTile) {
      // Things like ice barrage calculate distance to SW tile only
      this.distance = chebyshev([this.from.location.x, this.from.location.y], [this.to.location.x, this.to.location.y])
    } else {
      const closestTile = to.getClosestTileTo(this.from.location.x, this.from.location.y);      
      this.distance = chebyshev([this.from.location.x, this.from.location.y], [closestTile[0], closestTile[1]]);  
    }
    
    this.remainingDelay = weapon.calculateHitDelay(this.distance);
    if (from.isPlayer) {
      this.remainingDelay++;
    }
    if (this.options.reduceDelay) { 
      this.remainingDelay -= this.options.reduceDelay;
      if (this.remainingDelay < 1) {
        this.remainingDelay = 1;
      }
    }
    if (sound) {
      SoundCache.play(sound);
    }
  }

  onTick() {
    //
  }

  onHit() {
    //
  }
}
