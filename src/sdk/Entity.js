'use strict';
import Constants from "./Constants";
import Point from "./Utils/Point";

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
      this.location.x * Constants.tileSize,
      (this.location.y - this.size + 1) * Constants.tileSize,
      this.size * Constants.tileSize,
      this.size * Constants.tileSize
    );
    
  }
}
