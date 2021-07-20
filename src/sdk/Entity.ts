'use strict'
import { GameObject, Location } from './GameObject';
import { Region } from './Region'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'


export class Entity extends GameObject{
  region: Region;
  location: Location;

  constructor (region: Region, location: Location) {
    super()
    this.region = region
    this.location = location
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
