import { Location } from "./Location";

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

  drawUILayer(
    tickPercent: number,
    screenPosition: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number
  ) {
    // Override me
  }
}
