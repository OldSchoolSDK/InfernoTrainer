'use strict';
import { Settings } from "./Settings";
import { Unit } from "./Unit";


export class Entity {
  constructor(region, point, size) {
    this.region = region;
    this.location = point;
    this.size = size;
  }


  get type() {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return Unit.types.ENTITY;
  }

  tick(region) {
      
  }

  draw(region) {
    region.ctx.fillStyle = "#000073";

    region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );
    
  }
}
