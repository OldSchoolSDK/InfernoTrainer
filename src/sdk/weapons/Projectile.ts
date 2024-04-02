'use strict'


import chebyshev from 'chebyshev'
import { Location, Location3 } from "../Location"
import { Unit } from '../Unit'
import { Weapon } from '../gear/Weapon'
import { Sound, SoundCache } from '../utils/SoundCache'
import { Renderable } from '../Renderable'
import { Pathing } from '../Pathing'
import { BasicModel } from '../rendering/BasicModel'

export interface ProjectileMotionInterpolator {
  interpolate(from: Location3, to: Location3, percent: number): Location3;
}

export interface ProjectileOptions {
  forceSWTile?: boolean;
  hidden?: boolean;
  reduceDelay?: number;
  cancelOnDeath?: boolean;
  motionInterpolator?: ProjectileMotionInterpolator;
  // ticks until the projectile appears
  visualDelayTicks?: number;
}

export class Projectile extends Renderable {
  weapon: Weapon;
  damage: number;
  from: Unit;
  to: Unit;
  distance: number;
  options: ProjectileOptions = {};
  remainingDelay: number;
  totalDelay: number;
  age = 0;
  visualDelayTicks: number;
  startLocation: Location;
  currentLocation: Location;
  currentHeight: number;
  attackStyle: string;

  offsetX: number;
  offsetY: number;
  image: HTMLImageElement;

  interpolator: ProjectileMotionInterpolator;

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

    this.startLocation = {
      x: from.location.x + from.size / 2,
      y: from.location.y - from.size / 2 + 1
    }
    this.currentLocation = {...this.startLocation};
    this.currentHeight = from.height * 0.75; // projectile origin
    this.from = from
    this.to = to
    this.distance = 999999
    
    this.visualDelayTicks = options.visualDelayTicks || 0;

    if (Weapon.isMeleeAttackStyle(attackStyle)) {
      this.distance = 0
      this.remainingDelay = 1
    } else {
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
    }
    this.totalDelay = this.remainingDelay;
    if (sound) {
      SoundCache.play(sound);
    }
    this._color = this.getColor();

    if (this.options.motionInterpolator) {
      this.interpolator = this.options.motionInterpolator;
    } else {
      this.interpolator = new LinearProjectionMotionInterpolator();
    }
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
    } else if (this.attackStyle === "recoil") {
      return "#000000";
    }
    console.log("[WARN] This style is not accounted for in custom coloring: ", this.attackStyle);
    return "#000000";
  }

  onTick() {
    //
    this.remainingDelay--;
    this.age++;
  }

  onHit() {
    //
  }

  shouldDestroy() {
    return this.age >= this.totalDelay
  }

  get visible() {
    return this.age >= this.visualDelayTicks && this.age < this.totalDelay;
  }

  getPerceivedLocation(tickPercent: number) {
    // default linear
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const startHeight = this.currentHeight;
    const endX = this.to.location.x + this.to.size / 2;
    const endY = this.to.location.y - this.to.size / 2 + 1;
    const endHeight = this.to.height * 0.75;
    const percent = ((this.age - this.visualDelayTicks) + tickPercent) / (this.totalDelay - this.visualDelayTicks);
    return this.interpolator.interpolate({x: startX, y: startY, z: startHeight}, {x: endX, y: endY, z: endHeight}, percent);
  }

  get size(): number {
    return 0.5;
  }

  get color(): string {
    return this._color;
  }

  create3dModel() {
    if (this.options.hidden|| !this.attackStyle || this.color === "#000000" ) {
      return null;
    }
    return BasicModel.sphereForRenderable(this);
  }
}

export class LinearProjectionMotionInterpolator implements ProjectileMotionInterpolator {
  interpolate(from: Location3, to: Location3, percent: number): Location3 {
    // default linear
    const startX = from.x;
    const startY = from.y;
    const startHeight = from.z;
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;

    const perceivedX = Pathing.linearInterpolation(
      startX,
      endX,
      percent
    );
    const perceivedY = Pathing.linearInterpolation(
      startY,
      endY,
      percent
    );
    const perceivedHeight = (startHeight === endHeight) ? startHeight : Pathing.linearInterpolation(
      startHeight,
      endHeight,
      percent
    );
    return { x: perceivedX, y: perceivedY, z: perceivedHeight }
  }
}

export class ArcProjectionMotionInterpolator implements ProjectileMotionInterpolator {
  constructor(private height: number) {}

  interpolate(from: Location3, to: Location3, percent: number): Location3 {
    const startX = from.x;
    const startY = from.y;
    const startHeight = from.z;
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;

    const perceivedX = Pathing.linearInterpolation(
      startX,
      endX,
      percent
    );
    const perceivedY = Pathing.linearInterpolation(
      startY,
      endY,
      percent
    );
    const perceivedHeight = Math.sin(percent * Math.PI) * this.height + (endHeight - startHeight) + startHeight;
    return { x: perceivedX, y: perceivedY, z: perceivedHeight }
  }
}