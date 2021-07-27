'use strict'
import { WorldObject, Location } from './WorldObject';
import { World } from './World'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'


export class Entity extends WorldObject{
  world: World;
  location: Location;

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
    this.world.ctx.fillStyle = '#000073'

    this.world.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
