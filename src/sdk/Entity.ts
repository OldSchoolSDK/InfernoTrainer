'use strict'
import { GameObject, Location } from './GameObject';
import { Game } from './Game'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'


export class Entity extends GameObject{
  game: Game;
  location: Location;

  constructor (game: Game, location: Location) {
    super()
    this.game = game
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
    this.game.ctx.fillStyle = '#000073'

    this.game.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
