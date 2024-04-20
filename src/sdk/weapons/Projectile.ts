"use strict";

import chebyshev from "chebyshev";
import { Location, Location3 } from "../Location";
import { Unit } from "../Unit";
import { Weapon } from "../gear/Weapon";
import { Sound, SoundCache } from "../utils/SoundCache";
import { Renderable } from "../Renderable";
import { Pathing } from "../Pathing";
import { BasicModel } from "../rendering/BasicModel";
import { GLTFModel } from "../rendering/GLTFModel";
import { Collision } from "../Collision";
import { Settings } from "../Settings";
import { Viewport } from "../Viewport";

export interface ProjectileMotionInterpolator {
  interpolate(from: Location3, to: Location3, percent: number): Location3;
  interpolatePitch(from: Location3, to: Location3, percent: number): number;
}

export interface MultiModelProjectileOffsetInterpolator {
  // when there are multiple models, offset them by this much. Note that the projectile is already rotated towards
  // the target, so the X axis offsets the models left-to-right, and Y axis offsets the models forward-and-back.
  interpolateOffsets(from: Location3, to: Location3, percent: number): Location3[];
}

export interface ProjectileOptions {
  forceSWTile?: boolean;
  hidden?: boolean;
  // overrides reduceDelay
  setDelay?: number;
  reduceDelay?: number;
  cancelOnDeath?: boolean;
  color?: string;
  size?: number;
  motionInterpolator?: ProjectileMotionInterpolator;
  // ticks until the projectile appears
  visualDelayTicks?: number;
  // ticks before actually landing that the projectile hits the target. can be negative in which the projectile
  // 'lands' after the projectile hits
  visualHitEarlyTicks?: number;
  // played when the attack starts
  sound?: Sound;
  // played when the projectile is launched
  projectileSound?: Sound;
  // played when the projectile lands
  hitSound?: Sound;
  model?: string;
  modelScale?: number;
  // if there are multiple models
  models?: string[];
  offsetsInterpolator?: MultiModelProjectileOffsetInterpolator;
  // offset of start height
  verticalOffset?: number;
}

const targetIsLocation = (x: Unit | Location): x is Location => (x as Location).x !== undefined;
export class Projectile extends Renderable {
  weapon: Weapon;
  damage: number;
  from: Unit;
  to: Unit | Location3;
  distance: number;
  options: ProjectileOptions = {};
  remainingDelay: number;
  totalDelay: number;
  age = 0;
  startLocation: Location;
  currentLocation: Location;
  currentHeight: number;
  attackStyle: string;

  offsetX: number;
  offsetY: number;
  image: HTMLImageElement;

  interpolator: ProjectileMotionInterpolator;

  _color: string;
  _size: number;

  /*
    This should take the player and mob object, and do chebyshev on the size of them
  */
  constructor(
    weapon: Weapon,
    damage: number,
    from: Unit,
    to: Unit | Location3,
    attackStyle: string,
    options: ProjectileOptions = {},
  ) {
    super();
    this.attackStyle = attackStyle;
    this.damage = Math.floor(damage);
    if (!targetIsLocation(to) && this.damage > to.currentStats.hitpoint) {
      this.damage = to.currentStats.hitpoint;
    }
    this.options = {
      modelScale: 1.0,
      verticalOffset: 0.0,
      visualDelayTicks: 0,
      visualHitEarlyTicks: 0,
      ...options,
    };
    this.startLocation = {
      x: from.location.x + (from.size - 1) / 2,
      y: from.location.y - (from.size - 1) / 2,
    };
    this.currentLocation = { ...this.startLocation };
    this.currentHeight = from.height * 0.75 + this.options.verticalOffset; // projectile origin
    this.from = from;
    this.to = to;
    this.distance = 999999;

    if (Weapon.isMeleeAttackStyle(attackStyle)) {
      this.distance = 0;
      this.remainingDelay = 1;
    } else {
      if (weapon.image) {
        this.image = weapon.image;
      }

      if (options.forceSWTile) {
        // Things like ice barrage calculate distance to SW tile only
        const targetSW = targetIsLocation(to) ? to : to.location;
        this.distance = chebyshev(
          [this.from.location.x, this.from.location.y],
          [targetSW.x, targetSW.y],
        );
      } else if (targetIsLocation(to)) {
        const closestTile = to;
        const closestTileFrom = from.getClosestTileTo(to.x, to.y);
        this.distance = chebyshev([closestTileFrom[0], closestTileFrom[1]], [closestTile[0], closestTile[1]]);
      } else {
        const closestTile = to.getClosestTileTo(this.from.location.x, this.from.location.y);
        const closestTileFrom = from.getClosestTileTo(to.location.x, to.location.y);
        this.distance = chebyshev([closestTileFrom[0], closestTileFrom[1]], [closestTile[0], closestTile[1]]);
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

    this.checkSound(this.options.projectileSound, this.options.visualDelayTicks);
    this.checkSound(this.options.sound, 0);

    this.remainingDelay = options.setDelay || this.remainingDelay;
    this.totalDelay = this.remainingDelay;

    this._color = this.options.color || this.getColor();
    this._size = this.options.size || 0.5;

    if (this.options.motionInterpolator) {
      this.interpolator = this.options.motionInterpolator;
    } else {
      this.interpolator = new LinearProjectileMotionInterpolator();
    }
  }

  private getColor() {
    if (this.attackStyle === "slash" || this.attackStyle === "crush" || this.attackStyle === "stab") {
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

  getTargetDestination(tickPercent): Location3 {
    if (targetIsLocation(this.to)) {
      return this.to;
    }
    const { x: toX, y: toY } = this.to.getPerceivedLocation(tickPercent);
    const endHeight = this.to.height * 0.5;
    const targetSize = this.to.size;

    const x = toX + (targetSize - 1) / 2;
    const y = toY - (targetSize - 1) / 2;

    return { x, y, z: endHeight }
  }

  getPerceivedRotation(tickPercent) {
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const { x: endX, y: endY } = this.getTargetDestination(tickPercent);
    return -Pathing.angle(startX, startY, endX, endY);
  }

  getPerceivedPitch(tickPercent: number) {
    // pass in the CENTERED position of the projectile`
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const startHeight = this.currentHeight;
    const { x: endX, y: endY, z: endHeight } = this.getTargetDestination(tickPercent);
    const percent = this.getPercent(tickPercent);
    return this.interpolator.interpolatePitch(
      { x: startX, y: startY, z: startHeight },
      { x: endX, y: endY, z: endHeight },
      percent,
    );
  }

  private getPercent(tickPercent: number) {
    const numerator = this.age - this.options.visualDelayTicks + tickPercent;
    const denominator = this.totalDelay - this.options.visualDelayTicks - this.options.visualHitEarlyTicks;
    // special case for short lifetime projectiles - we let it appear early
    if (denominator <= 0 && this.age >= this.options.visualDelayTicks - 1) {
      return tickPercent;
    }
    return numerator / denominator;
  }

  checkSound(sound: Sound, delay: number) {
    if (Settings.playsAudio && sound && this.age === delay) {
      const player = Viewport.viewport.player;
      // projectiles launched at the player always play at full volume
      let volumeRatio =
        this.from === player || this.to === player
          ? 1.0
          : 1 /
            Pathing.dist(
              Viewport.viewport.player.location.x,
              Viewport.viewport.player.location.y,
              this.startLocation.x,
              this.startLocation.y,
            );
      volumeRatio = Math.min(1, Math.max(0, Math.sqrt(volumeRatio)));
      SoundCache.play({
        src: sound.src,
        volume: volumeRatio * sound.volume,
      });
    }
  }

  onTick() {
    const targetLocation = this.getTargetDestination(0.0);
    this.currentLocation = {
      x: Pathing.linearInterpolation(
        this.currentLocation.x,
        targetLocation.x,
        1 / (this.remainingDelay + 1),
      ),
      y: Pathing.linearInterpolation(
        this.currentLocation.y,
        targetLocation.y,
        1 / (this.remainingDelay + 1),
      ),
    };
    this.remainingDelay--;
    this.age++;
    this.checkSound(this.options.projectileSound, this.options.visualDelayTicks);
  }

  onHit() {
    if (this.options.hitSound) {
      SoundCache.play(this.options.hitSound);
    }
  }

  shouldDestroy() {
    return this.age >= this.totalDelay + Math.max(0, -this.options.visualHitEarlyTicks);
  }

  visible(tickPercent) {
    const percent = this.getPercent(tickPercent);
    return percent > 0 && percent <= 1;
  }

  getPerceivedLocation(tickPercent: number) {
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const startHeight = this.currentHeight;
    const { x: endX, y: endY, z: endHeight } = this.getTargetDestination(tickPercent);
    const percent = this.getPercent(tickPercent);
    return this.interpolator.interpolate(
      { x: startX, y: startY, z: startHeight },
      { x: endX, y: endY, z: endHeight },
      percent,
    );
  }

  getPerceivedOffsets(tickPercent: number): Location3[] {
    if (this.options.offsetsInterpolator) {
      const startX = this.startLocation.x;
      const startY = this.startLocation.y;
      const startHeight = this.currentHeight;
      const { x: endX, y: endY, z: endHeight } = this.getTargetDestination(tickPercent);
      const percent = this.getPercent(tickPercent);
      return this.options.offsetsInterpolator.interpolateOffsets(
        { x: startX, y: startY, z: startHeight },
        { x: endX, y: endY, z: endHeight },
        percent,
      );
    }
    return super.getPerceivedOffsets(tickPercent);
  }

  get size(): number {
    return this._size;
  }

  get color(): string {
    return this._color;
  }

  get drawOutline() {
    return false;
  }

  protected create3dModel() {
    if (this.options.hidden || !this.attackStyle || this.color === "#000000") {
      return null;
    }
    if (this.options.models) {
      return GLTFModel.forRenderableMulti(
        this,
        this.options.models,
        this.options.modelScale,
        0,
      );
    }
    if (this.options.model) {
      return GLTFModel.forRenderable(this, this.options.model, this.options.modelScale, 0);
    }
    return BasicModel.sphereForRenderable(this);
  }

  get animationIndex() {
    return 0;
  }
}

export class LinearProjectileMotionInterpolator implements ProjectileMotionInterpolator {
  interpolate(from: Location3, to: Location3, percent: number) {
    // default linear
    const startX = from.x;
    const startY = from.y;
    const startHeight = from.z;
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;

    const perceivedX = Pathing.linearInterpolation(startX, endX, percent);
    const perceivedY = Pathing.linearInterpolation(startY, endY, percent);
    const perceivedHeight =
      startHeight === endHeight ? startHeight : Pathing.linearInterpolation(startHeight, endHeight, percent);
    return { x: perceivedX, y: perceivedY, z: perceivedHeight };
  }

  interpolatePitch(from: Location3, to: Location3, percent: number) {
    return 0;
  }
}

export class ArcProjectileMotionInterpolator implements ProjectileMotionInterpolator {
  constructor(private height: number) {}

  interpolate(from: Location3, to: Location3, percent: number) {
    const startX = from.x;
    const startY = from.y;
    const startHeight = from.z;
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;

    const perceivedX = Pathing.linearInterpolation(startX, endX, percent);
    const perceivedY = Pathing.linearInterpolation(startY, endY, percent);
    const perceivedHeight =
      Math.sin(percent * Math.PI) * this.height + (endHeight - startHeight) * percent + startHeight;
    return { x: perceivedX, y: perceivedY, z: perceivedHeight };
  }

  interpolatePitch(from: Location3, to: Location3, percent: number) {
    return Math.sin(-(0.75 + percent * 0.5) * Math.PI);
  }
}


// Simply sticks to the target
export class FollowTargetInterpolator implements ProjectileMotionInterpolator {

  interpolate(from: Location3, to: Location3, percent: number) {
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;
    return { x: endX, y: endY, z: endHeight };
  }

  interpolatePitch(from: Location3, to: Location3, percent: number) {
    return 0;
  }
}
