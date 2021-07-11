'use strict';

import Constants from "../../../../sdk/Constants";

export class Nibbler {

  static size = 1;

  static image = null;

  constructor(point) {
    this.location = point;
  }

  setLocation(point) {
      this.location = point;
  }

  tick() {
  }

  draw(ctx) {
    ctx.fillStyle = "#0f0f3773";
    ctx.fillRect(
      this.location.x * Constants.tileSize,
      this.location.y * Constants.tileSize,
      Nibbler.size * Constants.tileSize,
      Nibbler.size * Constants.tileSize
    );
  }
}
