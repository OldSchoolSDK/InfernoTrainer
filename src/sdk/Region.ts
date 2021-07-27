'use strict'

import { Item } from "./Item"
import { World } from "./World"

// Base class for any trainer region.
export class Region{
  mapImage: HTMLImageElement;

  getName (): string {
    return 'My Region'
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

  mapImagePath (): string {
    return ''
  }

  // Spawn entities, NPCs, player and initialize any extra UI controls.
  initialize (world: World) {
  }

  drawWorldBackground(ctx: OffscreenCanvasRenderingContext2D) {

  }
}
