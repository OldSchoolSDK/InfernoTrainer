'use strict'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/Collision'
import { Settings } from '../sdk/Settings';
import { Location } from "../sdk/Location";
import { World } from '../sdk/World';
import { LineOfSight, LineOfSightMask } from '../sdk/LineOfSight';

export class TileMarker extends Entity {
  color: string = '#00FF00'

  constructor (world: World, location: Location, color: string) {
    super(world, location);
    this.color = color;
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get size() {
    return 1;
  }
  draw () {
    this.world.worldCtx.lineWidth = 2

    this.world.worldCtx.strokeStyle = this.color

    this.world.worldCtx.strokeRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

}
