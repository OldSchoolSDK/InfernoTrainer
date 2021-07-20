'use strict'
import { Region } from './Region'
import { Settings } from './Settings'
import { Unit, UnitTypes } from './Unit'

export class Entity {
  region: Region;
  location: any;
  size: number;
  dying: number;

  constructor (region: Region, location: any, size: number) {
    this.region = region
    this.location = location
    this.size = size
  }

  get type () {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return UnitTypes.ENTITY
  }

  tick () {

  }

  draw (framePercent: number) {
    this.region.ctx.fillStyle = '#000073'

    this.region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
