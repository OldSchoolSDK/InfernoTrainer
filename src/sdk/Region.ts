'use strict'

import { Item } from "./Item"
import { Game } from "./Game"

// Base class for any trainer scenario.
export class Region{
  getName (): string {
    return 'My Scenario'
  }

  get width (): number {
    return 29
  }

  get height (): number {
    return 30
  }

  getInventory (): Item[]{
    return []
  }

  // Spawn entities, NPCs, player and initialize any extra UI controls.
  initialize (game: Game) {
  }

  drawGameBackground(ctx: CanvasRenderingContext2D) {

  }
}
