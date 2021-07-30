'use strict'
import { filter, remove } from 'lodash'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/GameObject'

export class MovementBlocker extends Entity {



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
