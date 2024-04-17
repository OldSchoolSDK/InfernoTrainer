"use strict";
import { Entity } from "../sdk/Entity";

import { CollisionType } from "../sdk/Collision";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { Model } from "../sdk/rendering/Model";
import { EmptyModel } from "../sdk/rendering/EmptyModel";

export class InvisibleMovementBlocker extends Entity {
  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get collisionType() {
    return CollisionType.BLOCK_MOVEMENT;
  }

  get size() {
    return 1;
  }
  draw() {
    // force empty draw
  }

  create3dModel(): Model {
    return new EmptyModel();
  }
}
