'use strict'
import { GameObject, Location } from './GameObject';
import { World } from './World'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'
import { EntityName } from './EntityName';

export class Entity extends GameObject{
  world: World;
  location: Location;

  entityName(): EntityName {
    return null;
  }

  constructor (world: World, location: Location) {
    super()
    this.world = world
    this.location = location
  }

  get type () {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return UnitTypes.ENTITY
  }

  tick () {

  }

  drawUILayer(tickPercent: number){

  }

  
  draw (tickPercent: number) {
    this.world.worldCtx.fillStyle = '#000073'

    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
