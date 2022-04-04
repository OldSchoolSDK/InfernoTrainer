'use strict';
import { Settings } from './Settings';
import { Pathing } from './Pathing';
import { ClickController } from './ClickController';
import { Chrome } from './Chrome';
import { Player } from './Player';
import { ContextMenu } from './ContextMenu';
import { World } from './World';
import { ControlPanelController } from './ControlPanelController';
import { MapController } from './MapController';
import { XpDropController } from './XpDropController';
import { ImageLoader } from './utils/ImageLoader';
import ButtonActiveIcon from '../assets/images/interface/button_active.png'

export class Viewport {
  activeButtonImage: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon)
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

  tick() {
    
    if (MapController.controller && this.player) {
      MapController.controller.updateOrbsMask(this.player.currentStats, this.player.stats);
    }
  }


  
  drawRegion (world: World) {
    const region = this.player.region;

    region.context.save();
    region.drawWorldBackground()
    region.drawGroundItems(region.context)

    // Draw all things on the map
    region.entities.forEach((entity) => entity.draw(world.tickPercent))

    if (world.getReadyTimer <= 0) {
      region.mobs.forEach((mob) => mob.draw(world.tickPercent))
      region.newMobs.forEach((mob) => mob.draw(world.tickPercent))
    }
    
    region.players.forEach((player: Player) => {
      player.draw(world.tickPercent)
    })

    region.entities.forEach((entity) => entity.drawUILayer(world.tickPercent))

    if (world.getReadyTimer === 0) {
      region.mobs.forEach((mob) => mob.drawUILayer(world.tickPercent))

      region.players.forEach((player: Player) => {
        player.drawUILayer(world.tickPercent)
      })
    }

    region.context.restore();
  }

  draw (world: World) {
    this.context.globalAlpha = 1
    this.context.fillStyle = '#3B3224'
    this.context.restore()
    this.context.save()
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, 10000000, 1000000)
    const { width, height } = Chrome.size();
    if (Settings.rotated === 'south') {
      this.context.rotate(Math.PI)
      this.context.translate(-width, -height);
    }
    this.drawRegion(world)
    const { viewportX, viewportY } = this.getViewport(world.tickPercent);
    this.context.drawImage(this.player.region.canvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);
    this.context.restore()
    this.context.save();

    if (Settings.mobileCheck()) {
      this.context.fillStyle = '#FFFF00'
      this.context.font = (16) + 'px OSRS'
      this.context.textAlign = 'center'

      this.context.drawImage(this.activeButtonImage, 20, 20, this.activeButtonImage.width, this.activeButtonImage.height)
      this.context.fillText('RESET', 40, 45)

    }

    // draw control panel
    ControlPanelController.controller.draw()
    XpDropController.controller.draw(this.context, width - 140 - MapController.controller.width - (Settings.menuVisible ? 232 : 0), 0, world.tickPercent);
    MapController.controller.draw(this.context);
    this.contextMenu.draw()

    if (this.clickController.clickAnimation) {
      this.clickController.clickAnimation.draw()
    }

    this.context.restore()
    this.context.save()

    this.context.textAlign = 'left'
    if (world.getReadyTimer > 0) {
      this.context.font = '72px OSRS'
      this.context.textAlign = 'center'
      this.drawText(`GET READY...${world.getReadyTimer}`, width / 2, height / 2 - 50)
    }
  }
}
