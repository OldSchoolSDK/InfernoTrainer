'use strict'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/Collision'

export class Wall extends Entity {



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
