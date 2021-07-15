'use strict';
import { Settings } from "./Settings";

export class Entity {
  constructor(point, size) {
    this.location = point;
    this.size = size;
  }

  get isEntity() {
    return true;
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
