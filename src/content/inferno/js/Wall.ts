"use strict";

import { Entity, CollisionType } from "@supalosa/oldschool-trainer-sdk";

export class Wall extends Entity {
  get collisionType() {
    return CollisionType.BLOCK_MOVEMENT;
  }

  get size() {
    return 1;
  }
  draw() {
    // force empty draw
  }

  get color() {
    return "#222222";
  }
}
