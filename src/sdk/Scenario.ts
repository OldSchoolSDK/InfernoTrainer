'use strict'

import { Item } from "./Item"
import { Region } from "./Region"

// Base class for any trainer scenario.
export class Scenario{
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
  initialize (region: Region) {
  }

  drawRegionBackground(ctx: CanvasRenderingContext2D) {

  }
}
