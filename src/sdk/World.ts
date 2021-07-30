'use strict'
import { remove } from 'lodash'
import { ClickAnimation } from './ClickAnimation'
import { Settings } from './Settings'
import { ContextMenu, MenuOption } from './ContextMenu'
import { ControlPanelController } from './ControlPanelController'
import { Pathing } from './Pathing'
import { XpDropController } from './XpDropController'
import { Unit } from './Unit'
import { Player } from './Player'
import { Entity } from './Entity'
import { Mob } from './Mob'
import { Region } from './Region'
import { MapController } from './MapController'
import { DelayedAction } from './DelayedAction'
import { Collision } from './Collision'

class Viewport {
  center: Location;
  radius: number;
  constructor(center: Location, radius: number) {
    this.center = center;
    this.radius = radius;
  }
}

export class World {
  region: Region;
  wave: string;
  mobs: Mob[] = [];
  inputDelay?: NodeJS.Timeout = null;
  frameCounter: number = 0
  getReadyTimer: number = 6
  controlPanel: ControlPanelController;
  mapController: MapController;
  player?: Player;
  entities: Entity[] = [];
  viewportWidth: number;
  viewportHeight: number;
  worldCanvas: OffscreenCanvas;
  viewport: HTMLCanvasElement;
  contextMenu: ContextMenu = new ContextMenu();
  clickAnimation?: ClickAnimation = null;

  drawTime: number;
  frameTime: number;
  tickTime: number;
  timeBetweenTicks: number;
  fps: number;
  lastT: number;
  ticker: NodeJS.Timeout;
  tickPercent: number;
  isPaused: boolean = true;

  viewportController: Viewport;

  _viewport = {
    width: 40,
    height: 30
  }

  get viewportCtx() {
    return this.viewport.getContext('2d');
  }

  get worldCtx() {
    return this.worldCanvas.getContext('2d');
  }

  constructor (selector: string, region: Region, mapController: MapController, controlPanel: ControlPanelController, ) {

    this.region = region;
    this.mapController = mapController;
    this.controlPanel = controlPanel;
    this.controlPanel.setWorld(this);
    this.mapController.setWorld(this)


    this.worldCanvas = new OffscreenCanvas(this.region.width * Settings.tileSize, this.region.height * Settings.tileSize)

    // convert this to a world map canvas (offscreencanvas)
    this.viewport = document.getElementById(selector) as HTMLCanvasElement;


    // create new canvas that is the on screen canvas
    this.viewport.width = Settings.tileSize * this._viewport.width + this.mapController.width;
    this.viewport.height = Settings.tileSize * this._viewport.height
    this.viewportWidth = this._viewport.width
    this.viewportHeight = this._viewport.height

    this.registerClickActions();

  }

  registerClickActions() {
    this.viewport.addEventListener('mousedown', this.leftClickDown.bind(this))
    this.viewport.addEventListener('mouseup', this.leftClickUp.bind(this))
    this.viewport.addEventListener('mousemove', (e: MouseEvent) => this.controlPanel.cursorMovedTo(e))
    this.viewport.addEventListener('mousemove', (e: MouseEvent) => this.mapController.cursorMovedTo(e))
    this.viewport.addEventListener('mousemove', (e) => this.contextMenu.cursorMovedTo(this, e.clientX, e.clientY))
    this.viewport.addEventListener('contextmenu', this.rightClick.bind(this));
  }

  leftClickUp (e: MouseEvent) {

    if (e.button !== 0) {
      return;
    }
    const { viewportX, viewportY } = this.getViewport();
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewportWidth * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewportHeight * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    // if (e.offsetX > this.viewportWidth * Settings.tileSize) {
    //   if (e.offsetY < this.mapController.height) {
    //     const intercepted = this.mapController.clicked(e);
    //     if (intercepted) {
    //       return;
    //     }
    //   }
    // }

    if (e.offsetX > this.viewport.width - this.controlPanel.width) {
      if (e.offsetY > this.viewportHeight * Settings.tileSize - this.controlPanel.height){
        const intercepted = this.controlPanel.controlPanelClickUp(e);
        if (intercepted) {
          return;
        }
  
      }
    }

  }
  leftClickDown (e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }
    
    this.contextMenu.cursorMovedTo(this, e.clientX, e.clientY)
    const { viewportX, viewportY } = this.getViewport();
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewportWidth * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewportHeight * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    } 

    if (e.offsetX > this.viewportWidth * Settings.tileSize) {
      if (e.offsetY < this.mapController.height) {
        const intercepted = this.mapController.clicked(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (e.offsetX > this.viewport.width - this.controlPanel.width) {
      if (e.offsetY > this.viewportHeight * Settings.tileSize - this.controlPanel.height){
        const intercepted = this.controlPanel.controlPanelClickDown(e);
        if (intercepted) {
          return;
        }
  
      }
    }
    const xAlign = this.contextMenu.location.x - (this.contextMenu.width / 2) < e.offsetX && e.offsetX < this.contextMenu.location.x + this.contextMenu.width / 2
    const yAlign = this.contextMenu.location.y < e.offsetY && e.offsetY < this.contextMenu.location.y + this.contextMenu.height

    if (this.contextMenu.isActive && xAlign && yAlign) {
      this.contextMenu.clicked(this, e.offsetX, e.offsetY)
    } else {
      if (this.inputDelay) {
        clearTimeout(this.inputDelay)
      }

      const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, this.tickPercent)
      this.player.aggro = null
      if (mobs.length) {
        this.redClick()
        this.playerAttackClick(mobs[0])
      } else {
        this.yellowClick()
        this.playerWalkClick(x, y)
      }
    }
    this.contextMenu.setInactive()
  }

  rightClick (e: MouseEvent) {
    
    const { viewportX, viewportY } = this.getViewport();

    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    this.contextMenu.setPosition({ x: e.offsetX, y: e.offsetY })

    if (Settings.rotated === 'south') {
      x = this.viewportWidth * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewportHeight * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    this.contextMenu.destinationLocation = {
      x : Math.floor(x / Settings.tileSize),
      y : Math.floor(y / Settings.tileSize)
    }
    
    /* gather options */
    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, this.tickPercent)
    let menuOptions: MenuOption[] = []
    mobs.forEach((mob) => {
      menuOptions = menuOptions.concat(mob.contextActions(x, y))
    })
    this.contextMenu.setMenuOptions(menuOptions)
    this.contextMenu.setActive()
  }


  playerAttackClick (mob: Unit) {
    this.inputDelay = setTimeout(() => {
      this.player.aggro = mob
    }, Settings.inputDelay)
  }

  playerWalkClick (x: number, y: number) {
    this.inputDelay = setTimeout(() => {
      this.player.moveTo(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    }, Settings.inputDelay)
  }

  redClick () {
    this.clickAnimation = new ClickAnimation('red', this.contextMenu.cursorPosition.x, this.contextMenu.cursorPosition.y)
  }

  yellowClick () {
    this.clickAnimation = new ClickAnimation('yellow', this.contextMenu.cursorPosition.x, this.contextMenu.cursorPosition.y)
  }

  worldTick () {
    XpDropController.controller.tick();
    
    this.player.setPrayers(ControlPanelController.controls.PRAYER.getCurrentActivePrayers())
    this.entities.forEach((entity) => entity.tick())
    this.mobs.forEach((mob) => mob.movementStep())
    this.mobs.forEach((mob) => mob.attackStep())
    this.player.movementStep()
    this.player.attackStep()
    DelayedAction.tick();


    // Safely remove the mobs from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = this.mobs.filter((mob) => mob.dying === 0)
    const deadEntities = this.entities.filter((mob) => mob.dying === 0)
    deadMobs.forEach((mob) => this.removeMob(mob))
    deadEntities.forEach((entity) => this.removeEntity(entity))
  }

  worldLoop () {
    // Runs a tick every 600 ms (when frameCounter = 0), and draws every loop
    // Everything else is just measuring performance
    const t = performance.now()
    if (this.frameCounter === 0 && this.getReadyTimer) {
      this.getReadyTimer--;
    }

    if (this.frameCounter === 0 && this.getReadyTimer <= 0) {
      this.timeBetweenTicks = t - this.lastT
      this.lastT = t
      if (this.isPaused === false) {
        this.worldTick()
      }
      this.tickTime = performance.now() - t
    }
    const t2 = performance.now()
    this.tickPercent = this.frameCounter / Settings.framesPerTick;
    this.draw()
    this.drawTime = performance.now() - t2
    this.frameCounter++
    if (this.frameCounter >= Settings.framesPerTick) {
      this.fps = this.frameCounter / this.timeBetweenTicks * 1000
      this.frameCounter = 0
    }
    this.frameTime = performance.now() - t
  }

  drawWorld (tickPercent: number) {
    this.worldCtx.save();
    this.region.drawWorldBackground(this.worldCtx)

    // Draw all things on the map
    this.entities.forEach((entity) => entity.draw(tickPercent))

    if (this.getReadyTimer <= 0) {
      this.mobs.forEach((mob) => mob.draw(tickPercent))
    }
    this.player.draw(tickPercent)

    this.entities.forEach((entity) => entity.drawUILayer(tickPercent))

    if (this.getReadyTimer <= 0) {
      this.mobs.forEach((mob) => mob.drawUILayer(tickPercent))
    }
    this.player.drawUILayer(tickPercent)

    this.worldCtx.restore();
  }

  getViewport() {

    const perceivedX = Pathing.linearInterpolation(this.player.perceivedLocation.x, this.player.location.x, this.tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.player.perceivedLocation.y, this.player.location.y, this.tickPercent)

    let viewportX = perceivedX + 0.5 - this._viewport.width / 2;
    let viewportY = perceivedY + 0.5 - this._viewport.height / 2;


    if (viewportX < 0) {
      viewportX = 0
    }
    if (viewportY < 0) {
      viewportY = 0;
    }
    if (viewportX * Settings.tileSize + this._viewport.width * Settings.tileSize > this.region.width * Settings.tileSize) {
      viewportX = this.region.width - this._viewport.width;
    }
    if (viewportY * Settings.tileSize + this._viewport.height * Settings.tileSize > this.region.height * Settings.tileSize) {
      viewportY = this.region.height - this._viewport.height;
    }

    return {viewportX, viewportY}
  }

  draw () {
    this.viewportCtx.globalAlpha = 1
    this.viewportCtx.fillStyle = '#3B3224'

    this.viewportCtx.restore()
    this.viewportCtx.save()
    this.viewportCtx.fillStyle = '#3B3224'

    this.viewportCtx.fillRect(0, 0, this.viewport.width, this.viewport.height)

    if (Settings.rotated === 'south') {
      this.viewportCtx.translate(-this.mapController.width, 0);
      this.viewportCtx.rotate(Math.PI)
      this.viewportCtx.translate(-this.viewport.width, -this.viewport.height)
    }

    this.drawWorld(this.tickPercent)

    const { viewportX, viewportY } = this.getViewport();

    this.viewportCtx.drawImage(this.worldCanvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);

    this.viewportCtx.restore()
    this.viewportCtx.save();

    // draw control panel
    this.viewportCtx.translate(this.viewport.width - this.controlPanel.width, this.viewport.height - this.controlPanel.height)
    this.controlPanel.draw(this)

    this.viewportCtx.restore();

    XpDropController.controller.draw(this.viewportCtx, this.viewport.width - 140 - this.mapController.width, 0, this.tickPercent);
    MapController.controller.draw(this.viewportCtx, this.tickPercent);


    this.contextMenu.draw(this)
    if (this.clickAnimation) {
      this.clickAnimation.draw(this, this.tickPercent)
    }

    this.viewportCtx.restore()
    this.viewportCtx.save()

    // Performance info
    this.viewportCtx.textAlign = 'left'

    if (!process.env.BUILD_DATE) {
      this.viewportCtx.fillStyle = '#FFFF0066'
      this.viewportCtx.font = '16px OSRS'
      this.viewportCtx.fillText(`FPS: ${Math.round(this.fps * 100) / 100}`, 0, 16)
      this.viewportCtx.fillText(`DFR: ${Settings.framesPerTick * (1 / 0.6)}`, 0, 32)
      this.viewportCtx.fillText(`TBT: ${Math.round(this.timeBetweenTicks)}ms`, 0, 48)
      this.viewportCtx.fillText(`TT: ${Math.round(this.tickTime)}ms`, 0, 64)
      this.viewportCtx.fillText(`FT: ${Math.round(this.frameTime)}ms`, 0, 80)
      this.viewportCtx.fillText(`DT: ${Math.round(this.drawTime)}ms`, 0, 96)
      this.viewportCtx.fillText(`Wave: ${this.wave}`, 0, 112)  
    }

    if (this.getReadyTimer) {
      this.viewportCtx.font = '72px OSRS'
      this.viewportCtx.textAlign = 'center'
      this.viewportCtx.fillStyle = '#000'
      this.viewportCtx.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.width / 2 - 2, this.viewport.height / 2 - 50)
      this.viewportCtx.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.width / 2 + 2, this.viewport.height / 2 - 50)
      this.viewportCtx.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.width / 2, this.viewport.height / 2 - 48)
      this.viewportCtx.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.width / 2, this.viewport.height / 2 - 52)

      this.viewportCtx.fillStyle = '#FFFFFF'
      this.viewportCtx.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.width / 2, this.viewport.height / 2 - 50)
      this.viewportCtx.textAlign = 'left'
    }
  }

  setPlayer (player: Player) {
    this.player = player
  }

  addEntity (entity: Entity) {
    this.entities.push(entity)
  }

  removeEntity (entity: Entity) {
    remove(this.entities, entity)
  }

  addMob (mob: Mob) {
    this.mobs.push(mob)
  }

  removeMob (mob: Unit) {
    remove(this.mobs, mob)
  }

  startTicking () {
    this.isPaused = false;
    this.ticker = setInterval(this.worldLoop.bind(this), Settings.tickMs / Settings.framesPerTick)
  }

  stopTicking() {
    this.isPaused = true;
    clearInterval(this.ticker);
  }
}
