"use strict";
import { Entity } from "../sdk/Entity";

import { CollisionType } from "../sdk/Collision";
import { Settings } from "../sdk/Settings";
import { Location } from "../sdk/Location";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { EntityName } from "../sdk/EntityName";
import { Region } from "../sdk/Region";
import { Model } from "../sdk/rendering/Model";
import { TileMarkerModel } from "../sdk/rendering/TileMarkerModel";

export class TileMarker extends Entity {
  private _color = "#00FF00";

  _size = 1;
  saveable = true;
  constructor(region: Region, location: Location, color: string, size = 1, saveable = true) {
    super(region, location);
    this._color = color;
    this._size = size;
    this.saveable = saveable;
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

  get size() {
    return this._size;
  }

  get color() {
    return this._color;
  }

  draw() {
    this.region.context.lineWidth = 2;

    this.region.context.strokeStyle = this._color;

    this.region.context.strokeRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  create3dModel(): Model {
    return TileMarkerModel.forRenderable(this);
  }
}
