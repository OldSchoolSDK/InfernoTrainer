'use strict';
import { Settings } from "./Settings";
import { Unit } from "./Unit";


export class Entity {
  static collisionType = Object.freeze({
    NONE: 0,
    //BLOCK_MOVEMENT: 1, // like a fence. Not implemented yet.
    BLOCK_LOS: 2 // like a pillar
  });

  constructor(region, point, size) {
    this.region = region;
    this.location = point;
    this.size = size;
  }

  get type() {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return Unit.types.ENTITY;
  }

  // Specify how pathing and LOS calculations interact with this entity.
  get collisionType() {
    return Entity.collisionType.BLOCK_LOS;
  }

  get color() {
    return "#000073"
  }

  tick(region) {
      
  }

  draw(tickPercent) {
    this.region.ctx.fillStyle = this.color;

    this.region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );
    
  }
}
