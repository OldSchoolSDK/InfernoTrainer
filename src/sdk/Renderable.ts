import { Location } from "./Location";

import { Model } from "./rendering/Model";

export abstract class Renderable {
  abstract getPerceivedLocation(tickPercent: number): Location;

  abstract get size(): number;

  get height(): number {
    return 1;
  }

  abstract get color(): string;

  get colorHex() {
    return parseInt(this.color.replace("#", ""), 16);
  }

  get selectable(): boolean {
    return true;
  }

  drawUILayer(
    tickPercent: number,
    screenPosition: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number
  ) {
    // Override me
  }

  // draw in 2d mode
  draw(
    tickPercent: number,
    context: OffscreenCanvasRenderingContext2D,
    offset: Location = { x: 0, y: 0 },
    scale = 20
  ) {
    // Override me
  }

  /**
   * Return a new model for this renderable in 3d mode. it will be associated with the Renderable and destroyed when the renderable is
   * destroyed.
   */
  create3dModel(): Model | null {
    return null;
  }
}
