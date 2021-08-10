'use strict';
import { Settings } from './Settings';
import { Pathing } from './Pathing';
import { World } from './World';

export class Viewport {
  canvas: HTMLCanvasElement;

  width: number;
  height: number;

  _viewport = {
    width: 40,
    height: 30
  };

  get context() {
    return this.canvas.getContext('2d');
  }

  static createViewport(world: World, selector: string) {
    const viewport = new Viewport();

    // convert this to a world map canvas (offscreencanvas)
    viewport.canvas = document.getElementById(selector) as HTMLCanvasElement;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const widthRestrictors = 227 + 200;
    viewport._viewport.width = Math.ceil(Math.min(
      world.region.width,
      Math.floor(width / Settings.tileSize - (widthRestrictors / Settings.tileSize))
    ));
    viewport._viewport.height = Math.ceil(Math.min(world.region.height, Math.max(Math.floor(700 / Settings.tileSize), Math.floor(height / Settings.tileSize - (70 / Settings.tileSize)))));
    // create new canvas that is the on screen canvas
    viewport.canvas.width = Settings.tileSize * viewport._viewport.width + world.mapController.width;
    viewport.canvas.height = Settings.tileSize * viewport._viewport.height;
    viewport.width = viewport._viewport.width;
    viewport.height = viewport._viewport.height;
    return viewport;
    
  }

  getViewport(world: World) {

    const perceivedX = Pathing.linearInterpolation(world.player.perceivedLocation.x, world.player.location.x, world.tickPercent);
    const perceivedY = Pathing.linearInterpolation(world.player.perceivedLocation.y, world.player.location.y, world.tickPercent);

    let viewportX = perceivedX + 0.5 - this._viewport.width / 2;
    let viewportY = perceivedY + 0.5 - this._viewport.height / 2;

    if (parseInt(world.wave) < 67) {
      viewportX = 11;
      viewportY = 14;
    } else {
      if (viewportX < 0) {
        viewportX = 0;
      }
      if (viewportY < 0) {
        viewportY = 0;
      }
      if (viewportX + this._viewport.width > world.region.width) {
        viewportX = world.region.width - this._viewport.width;
      }
      if (viewportY + this._viewport.height > world.region.height) {
        viewportY = world.region.height - this._viewport.height;
      }
    }

    return { viewportX, viewportY };
  }
}
