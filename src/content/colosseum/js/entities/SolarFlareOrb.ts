"use strict";

import _ from "lodash";

import { Entity, Region, CollisionType, LineOfSightMask, Random, Projectile, Pathing, Location, Trainer } from "@supalosa/oldschool-trainer-sdk";

import { SolarFlareModel } from "../rendering/SolarFlareModel";


export class SolarFlareOrb extends Entity {
  moveTick = 4;
  waitTicks = 4;
  direction = { x: 0, y: 0 };
  lastLocation: Location;
  private boundaries: [Location, Location, Location, Location];
  private nextPositionIndex: number;

  constructor(
    region: Region,
    location: Location,
    private level: number,
    startAtIndex: number
  ) {
    super(region, location);
    this.boundaries = [
       { x: location.x, y: location.y }, 
       { x: location.x + 4, y: location.y },
       { x: location.x + 4, y: location.y + 4 },
       { x: location.x, y: location.y + 4 }
    ];
    this.location = { ...this.boundaries[startAtIndex] };
    this.nextPositionIndex = (startAtIndex + 1) % 4;
    const moveTowards = this.boundaries[this.nextPositionIndex];
    this.direction = {
      x: Math.sign(moveTowards.x - this.location.x),
      y: Math.sign(moveTowards.y - this.location.y),
    };
    this.lastLocation = {
      x: this.location.x,
      y: this.location.y,
    };
  }

  create3dModel() {
    return SolarFlareModel.forSolarFlare(this);
  }

  opacity(tickPercent) {
    return 0.5;
  }

  get color() {
    return "#FFFF66";
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get drawOutline() {
    return true;
  }

  get size() {
    return 1;
  }

  tick() {
    const player = Trainer.player;
    if (this.waitTicks <= 0 && this.moveTick <= 0) {
      this.lastLocation = {
        x: this.location.x,
        y: this.location.y,
      };
      this.location.x += this.direction.x;
      this.location.y += this.direction.y;
      // reverse direction
      const destination = this.boundaries[this.nextPositionIndex];
      if (this.location.x === destination.x && this.location.y === destination.y) {
        this.nextPositionIndex = (this.nextPositionIndex + 1) % 4;
        const moveTowards = this.boundaries[this.nextPositionIndex];
        this.direction = {
          x: Math.sign(moveTowards.x - this.location.x),
          y: Math.sign(moveTowards.y - this.location.y),
        };
        if (this.level === 1) {
          this.waitTicks = 7;
        } else if (this.level === 3) {
          this.waitTicks = 2;
        }
      }
      this.moveTick = this.level <= 2 ? 2 : 1;
    }
    --this.moveTick;
    --this.waitTicks;
    if (this.moveTick <= 0 && player.dying < 0 && player.location.x === this.location.x && player.location.y === this.location.y) {
      const damage = this.level <= 1 ? 5 + Math.floor(Random.get() * 5) : 10 + Math.floor(Random.get() * 10);
      player.addProjectile(new Projectile(null, damage, player, player, "typeless", { setDelay: 0 }));
      if (this.level === 3) {
        player.prayerController.findPrayerByName("Protect from Melee")?.deactivate();
        player.prayerController.findPrayerByName("Protect from Range")?.deactivate();
        player.prayerController.findPrayerByName("Protect from Magic")?.deactivate();
      }
    }
  }

  public setLevel(level: number) {
    this.level = _.clamp(level, 1, 3);
  }

  getPerceivedLocation(tickPercent) {
    const offset = this.level <= 2 ? 1 : 0;
    const ticksPerTile = this.level <= 2 ? 2.0 : 1.0;
    const percent = _.clamp((offset - this.moveTick + tickPercent) / ticksPerTile, 0, 1);
    return {
      x: Pathing.linearInterpolation(this.lastLocation.x, this.location.x, percent),
      y: Pathing.linearInterpolation(this.lastLocation.y, this.location.y, percent),
      z: 0
    }
  }
}
