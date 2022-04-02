'use strict'
import { GameObject } from './GameObject';
import { Location } from "./Location";
import { World } from './World'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'
import { EntityName } from './EntityName';
import { Region } from './Region';

export class Entity extends GameObject{
  location: Location;

  entityName(): EntityName {
    return null;
  }

  constructor ( region: Region, location: Location) {
    super()
    this.location = location
    this.region = region;
  }

  get type () {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return UnitTypes.ENTITY
  }

  tick () {
    // Override me
  }

  drawUILayer(tickPercent: number){
    // Override me
  }

  
  draw (tickPercent: number) {
    this.region.context.fillStyle = '#000073'

    this.region.context.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
