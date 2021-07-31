'use strict'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/Collision'
import { Settings } from '../sdk/Settings';
import { Location } from '../sdk/GameObject';
import { World } from '../sdk/World';

export class TileMarker extends Entity {
  color: string = '#00FF00'

  constructor (world: World, location: Location, color: string) {
    super(world, location);
    this.color = color;
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get size() {
    return 1;
  }
  draw () {
    console.log('drawing')
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
