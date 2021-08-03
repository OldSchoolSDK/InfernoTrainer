'use strict'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/Collision'
import { LineOfSightMask } from '../sdk/LineOfSight';

export class MovementBlocker extends Entity {


  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get collisionType() {
    return CollisionType.BLOCK_MOVEMENT;
  }

  get size() {
    return 1;
  }
  draw (tickPercent: number) {
     // force empty draw
  }
}
