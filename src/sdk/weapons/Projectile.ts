'use strict'


import chebyshev from 'chebyshev'
import { Location } from "../Location"
import { Unit } from '../Unit'
import { Weapon } from '../gear/Weapon'
import { Sound, SoundCache } from '../utils/SoundCache'
import { Renderable } from '../Renderable'
import { Pathing } from '../Pathing'
import { BasicModel } from '../rendering/BasicModel'

export interface ProjectileOptions {
  forceSWTile?: boolean;
  hidden?: boolean;
  reduceDelay?: number;
  cancelOnDeath?: boolean;
}

export class Projectile extends Renderable {
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

  _color: string;

  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor (weapon: Weapon, damage: number, from: Unit, to: Unit, attackStyle: string, options: ProjectileOptions = {}, sound: Sound | null = null) {
    super();
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
    this._color = this.getColor();
  }

  private getColor() {
    if (
      this.attackStyle === "slash" ||
      this.attackStyle === "crush" ||
      this.attackStyle === "stab"
    ) {
      return "#FF0000";
    } else if (this.attackStyle === "range") {
      return "#00FF00";
    } else if (this.attackStyle === "magic") {
      return "#0000FF";
    } else if (this.attackStyle === "heal") {
      return "#9813aa";
    } else {
      console.log("[WARN] This style is not accounted for in custom coloring: ", this.attackStyle);
      return "#000000";
    }
  }

  onTick() {
    //
  }

  onHit() {
    //
  }

  getPerceivedLocation(tickPercent: number) {
    // default linear
    const startX = this.currentLocation.x;
    const startY = this.currentLocation.y;
    const startHeight = this.currentHeight;
    const endX = this.to.location.x + this.to.size / 2;
    const endY = this.to.location.y - this.to.size / 2 + 1;
    const endHeight = this.to.height * 0.75;

    const perceivedX = Pathing.linearInterpolation(
      startX,
      endX,
      tickPercent / (this.remainingDelay + 1)
    );
    const perceivedY = Pathing.linearInterpolation(
      startY,
      endY,
      tickPercent / (this.remainingDelay + 1)
    );
    const perceivedHeight = (startHeight === endHeight) ? startHeight : Pathing.linearInterpolation(
      startHeight,
      endHeight,
      tickPercent / (this.remainingDelay + 1)
    );
    return { x: perceivedX, y: perceivedY, z: perceivedHeight }
  }

  get size(): number {
    return 0.5;
  }

  get color(): string {
    return this._color;
  }

  create3dModel() {
    return BasicModel.sphereForRenderable(this);
  }
}
