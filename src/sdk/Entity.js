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

  tick(stage) {
      
  }

  draw(stage) {
    stage.ctx.fillStyle = "#000073";

    stage.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );
    
  }
}
