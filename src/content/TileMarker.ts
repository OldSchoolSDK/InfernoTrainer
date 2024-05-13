"use strict";
import { Entity } from "../sdk/Entity";

import { CollisionType } from "../sdk/Collision";
import { Settings } from "../sdk/Settings";
import { Location } from "../sdk/Location";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { EntityNames } from "../sdk/EntityName";
import { Region } from "../sdk/Region";
import { Model } from "../sdk/rendering/Model";
import { TileMarkerModel } from "../sdk/rendering/TileMarkerModel";

export class TileMarker extends Entity {
  private _color = "#00FF00";

  static saveableMarkers: TileMarker[] = [];
  static onSetColor(color: string) {
    // saveable tile markers change color
    TileMarker.saveableMarkers.forEach((marker) => {
      marker._color = color;
    });
  }

  static loadAll(region: Region) {
    if (Settings.tile_markers) {
      Settings.tile_markers
        .map((location: Location) => {
          return new TileMarker(region, location, Settings.tileMarkerColor);
        })
        .forEach((tileMarker: TileMarker) => {
          region.addEntity(tileMarker);
        });
    }
  }

  _size = 1;
  saveable = true;
  constructor(region: Region, location: Location, color: string, size = 1, saveable = true) {
    super(region, location);
    this._color = color;
    this._size = size;
    this.saveable = saveable;
    if (saveable) {
      TileMarker.saveableMarkers.push(this);
    }
  }

  entityName() {
    return EntityNames.TILE_MARKER;
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
