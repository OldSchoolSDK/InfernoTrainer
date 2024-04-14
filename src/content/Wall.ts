"use strict";
import { Entity } from "../sdk/Entity";

import { CollisionType } from "../sdk/Collision";
import { Model } from "../sdk/rendering/Model";

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
