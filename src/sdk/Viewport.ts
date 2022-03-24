'use strict';
import { Settings } from './Settings';
import { Pathing } from './Pathing';
import { World } from './World';
import { ClickController } from './ClickController';


export class Viewport {
  clickController: ClickController;
  canvas: HTMLCanvasElement;
  world: World;

  width: number;
  height: number;

  _viewport = {
    width: 40,
    height: 30
  };

  get context() {
    return this.canvas.getContext('2d');
  }

  constructor(world: World) {
    window.addEventListener('resize', () => this.initializeViewport(world));
    this.initializeViewport(world);
    this.world = world;
    this.clickController = new ClickController(this);
    this.clickController.registerClickActions(world)
  }

  initializeViewport(world: World) {
    // convert this to a world map canvas (offscreencanvas)
    this.canvas = document.getElementById('world') as HTMLCanvasElement;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    Settings.tileSize = width / world.region.width;
    // todo: refactor how viewport works to not need this width restrictor anymore.
    const widthRestrictors =  (Settings.menuVisible ? 220 : 0); // 227 = control panel width, 200 = side menu, when opened

    this._viewport.width = ((width - widthRestrictors) / Settings.tileSize);
    this._viewport.height = (height / Settings.tileSize);
    // create new canvas that is the on screen canvas
    this.canvas.width = Settings.tileSize * this._viewport.width;// + world.mapController.width;
    this.canvas.height = Settings.tileSize * this._viewport.height;
    this.width = this._viewport.width;
    this.height = this._viewport.height;
    world.region.canvas = new OffscreenCanvas(world.region.width * Settings.tileSize, world.region.height * Settings.tileSize)

  }

  getViewport(world: World) {

    const perceivedX = Pathing.linearInterpolation(world.player.perceivedLocation.x, world.player.location.x, world.tickPercent);
    const perceivedY = Pathing.linearInterpolation(world.player.perceivedLocation.y, world.player.location.y, world.tickPercent);

    let viewportX = perceivedX + 0.5 - this._viewport.width / 2;
    let viewportY = perceivedY + 0.5 - this._viewport.height / 2;


    // if (viewportX < 0) {
    //   viewportX = 0;
    // }
    // if (viewportY < 0) {
    //   viewportY = 0;
    // }
    // if (viewportX + this._viewport.width > world.region.width) {
    //   viewportX = world.region.width - this._viewport.width;
    // }
    // if (viewportY + this._viewport.height > world.region.height) {
    //   viewportY = world.region.height - this._viewport.height;
    // }

    return { viewportX, viewportY };
  }
}
