'use strict';
import { Settings } from './Settings';
import { Pathing } from './Pathing';
import { World } from './World';
import { ClickController } from './ClickController';
import { Chrome } from './Chrome';

export class Viewport {
  clickController: ClickController;
  canvas: HTMLCanvasElement;
  world: World;

  width: number;
  height: number;

  get context() {
    return this.canvas.getContext('2d');
  }

  constructor(world: World) {
    window.addEventListener("orientationchange", () => this.initializeViewport(world));
    window.addEventListener('resize', () => this.initializeViewport(world));
    window.addEventListener('wheel', () => this.initializeViewport(world));
    window.addEventListener('resize', () => this.initializeViewport(world));
    this.initializeViewport(world);
    

    this.canvas.width = Settings._tileSize * 2 * this.width;// + world.mapController.width;
    this.canvas.height = Settings._tileSize * 2 * this.height;

    this.world = world;
    this.clickController = new ClickController(this);
    this.clickController.registerClickActions(world)
  }

  initializeViewport(world: World) {
    // convert this to a world map canvas (offscreencanvas)
    this.canvas = document.getElementById('world') as HTMLCanvasElement;
    const { width, height } = Chrome.size();
    
    Settings._tileSize = width / world.region.width;
    // // todo: refactor how viewport works to not need this width restrictor anymore.

    const widthRestrictors =  (Settings.menuVisible ? 220 : 0);
    this.width = ((width - widthRestrictors) / Settings.tileSize);
    this.height = (height / Settings.tileSize);

  }

  getViewport(world: World) {

    const perceivedX = Pathing.linearInterpolation(world.player.perceivedLocation.x, world.player.location.x, world.tickPercent);
    const perceivedY = Pathing.linearInterpolation(world.player.perceivedLocation.y, world.player.location.y, world.tickPercent);

    let viewportX = perceivedX + 0.5 - this.width / 2;
    let viewportY = perceivedY + 0.5 - this.height / 2;


    // if (viewportX < 0) {
    //   viewportX = 0;
    // }
    // if (viewportY < 0) {
    //   viewportY = 0;
    // }
    // if (viewportX + this.width > world.region.width) {
    //   viewportX = world.region.width - this.width;
    // }
    // if (viewportY + this.height > world.region.height) {
    //   viewportY = world.region.height - this.height;
    // }

    return { viewportX, viewportY };
  }
}
