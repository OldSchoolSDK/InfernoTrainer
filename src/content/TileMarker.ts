'use strict'
import { Entity } from '../sdk/Entity'

import { CollisionType } from '../sdk/Collision'
import { Settings } from '../sdk/Settings';
import { Location } from "../sdk/Location";
import { World } from '../sdk/World';
import { LineOfSight, LineOfSightMask } from '../sdk/LineOfSight';
import { EntityName } from '../sdk/EntityName';

export class TileMarker extends Entity {
  color: string = '#00FF00'

  _size: number = 1;
  saveable: boolean = true;; 
  constructor (world: World, location: Location, color: string) {
    super(world, location);
    this.color = color;
  }

  entityName(): EntityName {
    return EntityName.TILE_MARKER;
  }

  
  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  setTileMarkerSize(size: number) {
    this._size = size;
  }

  get size() {
    return this._size;
  }

  draw () {
    this.world.region.context.lineWidth = 2

    this.world.region.context.strokeStyle = this.color

    this.world.region.context.strokeRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

}
