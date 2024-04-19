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
  // ticks before actually landing that the projectile hits the target
  visualHitEarlyTicks?: number;
  // played when the attack starts
  sound?: Sound;
  // played when the projectile is launched
  projectileSound?: Sound;
  // played when the projectile lands
  hitSound?: Sound;
  model?: string;
  modelScale?: number;
  verticalOffset?: number;
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
    to: Unit,
    attackStyle: string,
    options: ProjectileOptions = {},
  ) {
    super();
    this.attackStyle = attackStyle;
    this.damage = Math.floor(damage);
    if (this.damage > to.currentStats.hitpoint) {
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
      x: from.location.x + from.size / 2,
      y: from.location.y - from.size / 2 + 1,
    };
    this.currentLocation = { ...this.startLocation };
    this.currentHeight = from.height * 0.75; // projectile origin
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
        this.distance = chebyshev(
          [this.from.location.x, this.from.location.y],
          [this.to.location.x, this.to.location.y],
        );
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

  getPerceivedRotation(tickPercent) {
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const { x: toX, y: toY } = this.to.getPerceivedLocation(tickPercent);

    const endX = toX + this.to.size / 2 - 1; // why? 2am me doesn't know
    const endY = toY - this.to.size / 2 + 1;
    return -Pathing.angle(startX, startY, endX, endY);
  }

  getPerceivedPitch(tickPercent: number) {
    // pass in the CENTERED position of the projectile`
    const startX = this.startLocation.x;
    const startY = this.startLocation.y;
    const startHeight = this.currentHeight;
    const { x: toX, y: toY } = this.to.getPerceivedLocation(tickPercent);
    const endX = toX + this.to.size / 2 - 1; // why? 2am me doesn't know
    const endY = toY - this.to.size / 2 + 1;
    const endHeight = this.to.height * 0.5;
    const percent = this.getPercent(tickPercent);
    return this.interpolator.interpolatePitch(
      { x: startX, y: startY, z: startHeight },
      { x: endX, y: endY, z: endHeight },
      percent,
    );
  }

  private getPercent(tickPercent) {
    return (this.age - this.options.visualDelayTicks + tickPercent) / Math.max(1, this.totalDelay - this.options.visualDelayTicks - this.options.visualHitEarlyTicks);
  }

  checkSound(sound: Sound, delay: number) {
    if (Settings.playsAudio && sound && this.age === delay) {
      const player = Viewport.viewport.player;
      // projectiles launched at the player always play at full volume
      let volumeRatio = (this.from === player || this.to === player) ? 1.0 :
        1 /
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
    this.remainingDelay--;
    this.age++;
    this.checkSound(this.options.projectileSound, this.options.visualDelayTicks);
  }

  onHit() {
    //
    if (this.options.hitSound) {
      SoundCache.play(this.options.hitSound);
    }
  }

  shouldDestroy() {
    return this.age >= this.totalDelay;
  }

  visible(tickPercent) {
    const percent = this.getPercent(tickPercent);
    return percent > 0 && percent <= 1;
  }

  getPerceivedLocation(tickPercent: number) {
    // pass in the CENTERED position of the projectile
    const startX = this.startLocation.x - this.size / 2;
    const startY = this.startLocation.y - this.size / 2;
    const startHeight = this.currentHeight;
    const { x: toX, y: toY } = this.to.getPerceivedLocation(tickPercent);
    const endX = toX + this.to.size / 2 - 1; // why? 2am me doesn't know
    const endY = toY - this.to.size / 2 + 1;
    const endHeight = this.to.height * 0.5;
    const percent = this.getPercent(tickPercent);
    return this.interpolator.interpolate(
      { x: startX, y: startY, z: startHeight },
      { x: endX, y: endY, z: endHeight },
      percent,
    );
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
    if (this.options.model) {
      return GLTFModel.forRenderable(this, this.options.model, this.options.modelScale, this.options.verticalOffset);
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

export class CeilingFallMotionInterpolator implements ProjectileMotionInterpolator {
  constructor(private height: number) {}

  interpolate(from: Location3, to: Location3, percent: number) {
    const startHeight = to.z + this.height;
    const endX = to.x;
    const endY = to.y;
    const endHeight = to.z;

    const perceivedX = endX;
    const perceivedY = endY;
    // Round to make it a bit jerky
    const perceivedHeight = (Math.round(percent * 10) / 10) * (endHeight - startHeight) + startHeight;
    return { x: perceivedX, y: perceivedY, z: perceivedHeight };
  }

  interpolatePitch(from: Location3, to: Location3, percent: number) {
    return 0;
  }
}
