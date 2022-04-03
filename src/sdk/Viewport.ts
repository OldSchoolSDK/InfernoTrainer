'use strict';
import { Settings } from './Settings';
import { Pathing } from './Pathing';
import { ClickController } from './ClickController';
import { Chrome } from './Chrome';
import { Player } from './Player';
import { ContextMenu } from './ContextMenu';

export class Viewport {
  contextMenu: ContextMenu = new ContextMenu();
  static viewport = new Viewport();
  clickController: ClickController;
  canvas: HTMLCanvasElement;
  player: Player;

  width: number;
  height: number;

  get context() {
    return this.canvas.getContext('2d');
  }

  setPlayer(player: Player) {
    this.player = player;
    window.addEventListener("orientationchange", () => this.calculateViewport());
    window.addEventListener('resize', () => this.calculateViewport());
    window.addEventListener('wheel', () => this.calculateViewport());
    window.addEventListener('resize', () => this.calculateViewport());
    this.canvas = document.getElementById('world') as HTMLCanvasElement;
    this.calculateViewport();
    this.canvas.width = Settings._tileSize * 2 * this.width;
    this.canvas.height = Settings._tileSize * 2 * this.height;
    this.clickController = new ClickController(this);
    this.clickController.registerClickActions()
  }

  calculateViewport() {
    const { width, height } = Chrome.size();
    Settings._tileSize = width / this.player.region.width;
    this.width = (width / Settings.tileSize);
    this.height = (height / Settings.tileSize);
  }

  getViewport(tickPercent: number) {
    const perceivedX = Pathing.linearInterpolation(this.player.perceivedLocation.x, this.player.location.x, tickPercent);
    const perceivedY = Pathing.linearInterpolation(this.player.perceivedLocation.y, this.player.location.y, tickPercent);

    const viewportX = perceivedX + 0.5 - this.width / 2;
    const viewportY = perceivedY + 0.5 - this.height / 2;
    return { viewportX, viewportY };
  }

  
  drawText(text: string, x: number, y: number) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.context.fillStyle = '#000'
    this.context.fillText(text, x - 2, y - 2)
    this.context.fillText(text, x + 2, y - 2)
    this.context.fillText(text, x, y)
    this.context.fillText(text, x, y - 4)
    this.context.fillStyle = '#FFFFFF'
    this.context.fillText(text, x, y - 2)
  }


}
