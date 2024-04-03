import { Location, Location3 } from "./Location";

import { Model } from "./rendering/Model";

export abstract class Renderable {
  private _selected = false;

  abstract getPerceivedLocation(tickPercent: number): Location3;

  /**
   * return the angle of this renderable in radians.
   * West is zero degrees, and increasing values represent clockwise rotation.
   */
  abstract getPerceivedRotation(tickPercent: number): number;

  abstract get size(): number;

  get height(): number {
    return this.size;
  }

  abstract get color(): string;

  get colorHex() {
    return parseInt(this.color.replace("#", ""), 16);
  }

  get selectable(): boolean {
    return true;
  }

  get visible(): boolean {
    return true;
  }

  /**
   * Should remove from the scene
   */
  abstract shouldDestroy(): boolean;

  get selected(): boolean {
    return this._selected;
  }

  set selected(selected: boolean) {
    this._selected = selected
  }

  drawUILayer(
    tickPercent: number,
    screenPosition: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number,
    hitsplatAbove = true,
  ) {
    // Override me
  }

  // draw in 2d mode
  draw(
    tickPercent: number,
    context: OffscreenCanvasRenderingContext2D,
    offset: Location = { x: 0, y: 0 },
    scale = 20,
    drawUnderTile = true,
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
