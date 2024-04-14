"use strict";
import { Location } from "./Location";
import { Settings } from "./Settings";
import { UnitTypes } from "./Unit";
import { EntityName } from "./EntityName";
import { Region } from "./Region";
import { clamp } from "lodash";
import { CollisionType } from "./Collision";
import { LineOfSightMask } from "./LineOfSight";
import { Renderable } from "./Renderable";

export class Entity extends Renderable {
  region: Region;
  location: Location;
  dying = -1;
  _serialNumber: string;
  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random());
    }
    return this._serialNumber;
  }

  // entities are not selectable by default
  get selectable() {
    return false;
  }

  shouldDestroy() {
    return this.dying === 0;
  }

  get size() {
    return 1;
  }

  isDying() {
    return this.dying > 0;
  }

  get collisionType() {
    return CollisionType.BLOCK_MOVEMENT;
  }

  get lineOfSight(): LineOfSightMask {
    return LineOfSightMask.FULL_MASK;
  }

  // Returns true if this game object is on the specified tile.
  isOnTile(x: number, y: number) {
    return (
      x >= this.location.x &&
      x <= this.location.x + this.size &&
      y <= this.location.y &&
      y >= this.location.y - this.size
    );
  }

  // Returns the closest tile on this mob to the specified point.
  getClosestTileTo(x: number, y: number) {
    // We simply clamp the target point to our own boundary box.
    return [
      clamp(x, this.location.x, this.location.x + this.size - 1),
      clamp(y, this.location.y - this.size + 1, this.location.y),
    ];
  }

  entityName(): EntityName {
    return null;
  }

  constructor(region: Region, location: Location) {
    super();
    this.location = location;
    this.region = region;
  }

  getPerceivedLocation() {
    return {
      ...this.location,
      z: 0,
    };
  }

  getPerceivedRotation() {
    return 0;
  }

  get color() {
    return "#000073";
  }

  get type() {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return UnitTypes.ENTITY;
  }

  tick() {
    // Override me
  }

  drawUILayer(tickPercent: number) {
    // Override me
  }

  draw(tickPercent: number, context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = "#000073";
    context.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  get animationIndex() {
    return -1;
  }
}
