'use strict'
import { remove, times } from 'lodash'
import { Settings } from './Settings'
import { ContextMenu, MenuOption } from './ContextMenu'
import { ControlPanelController } from './ControlPanelController'
import { XpDropController } from './XpDropController'
import { Unit } from './Unit'
import { Player } from './Player'
import { Entity } from './Entity'
import { Mob } from './Mob'
import { Region } from './Region'
import { MapController } from './MapController'
import { DelayedAction } from './DelayedAction'
import { Viewport } from './Viewport'

export class World {
  viewport: Viewport;
  region: Region;
  player?: Player;

  // move to region soon?
  newMobs: Mob[] = [];
  mobs: Mob[] = [];
  entities: Entity[] = [];

  controlPanel: ControlPanelController;
  mapController: MapController;
  contextMenu: ContextMenu = new ContextMenu();

  tickCounter: number = 0;
  isPaused: boolean = true;
  tickPercent: number;

  getReadyTimer: number = 6
  
  deltaTimeSincePause: number = -1;
  deltaTimeSinceLastTick: number = -1;

  constructor (region: Region, mapController: MapController, controlPanel: ControlPanelController, ) {

    this.region = region;
    this.mapController = mapController;
    this.controlPanel = controlPanel;
    this.controlPanel.setWorld(this);
    this.mapController.setWorld(this)
    this.region.canvas = new OffscreenCanvas(this.region.width * Settings.tileSize, this.region.height * Settings.tileSize)

    this.viewport = new Viewport(this);

  }

  fpsInterval = 1000 / Settings.fps;
  then: number;
  startTime: number;
  frameCount: number = 0;
  tickTimer: number = 0;
  startTicking () {
    this.isPaused = false;
    if (this.deltaTimeSincePause === -1) {
      this.tickTimer = window.performance.now();
      this.then = window.performance.now();
    }else{
      this.then = window.performance.now() - this.deltaTimeSincePause;

      this.tickTimer = window.performance.now() - this.deltaTimeSinceLastTick;

      this.deltaTimeSincePause = -1;
    }
    this.worldLoop(window.performance.now());
  }

  stopTicking() {
    this.deltaTimeSincePause = window.performance.now() - this.then;
    this.deltaTimeSinceLastTick = window.performance.now() - this.tickTimer;
    this.isPaused = true;
  }

  worldLoop (now: number) {
    window.requestAnimationFrame(this.worldLoop.bind(this));

    const elapsed = now - this.then;

    const tickElapsed = now - this.tickTimer;

    if (tickElapsed >= 600 && this.isPaused === false) {
      this.tickTimer = now;
      this.getReadyTimer--;
      if (this.getReadyTimer <=0){
        this.worldTick();
      }
    }

    if (elapsed > this.fpsInterval && this.isPaused === false) {
      this.tickPercent = (window.performance.now() - this.tickTimer) / Settings.tickMs;
      this.then = now - (elapsed % this.fpsInterval);
      this.draw();
      this.frameCount ++;
    }
  }

  worldTick () {
    this.tickCounter++;
    if (this.newMobs.length){
      this.mobs.unshift(...this.newMobs)
      this.newMobs = [];
    }
    XpDropController.controller.tick();

    this.player.setPrayers(ControlPanelController.controls.PRAYER.getCurrentActivePrayers())
    this.entities.forEach((entity) => entity.tick())
    this.mobs.forEach((mob) => {
      mob.ticksAlive++;
      mob.movementStep()
    })
    this.mobs.forEach((mob) => mob.attackStep())
    this.player.movementStep()
    this.player.ticksAlive++;
    this.player.attackStep()
    DelayedAction.tick();


    // Safely remove the mobs from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = this.mobs.filter((mob) => mob.dying === 0)
    const deadEntities = this.entities.filter((mob) => mob.dying === 0)
    deadMobs.forEach((mob) => this.removeMob(mob))
    deadEntities.forEach((entity) => this.removeEntity(entity))
  }

  drawWorld (tickPercent: number) {
    this.region.context.save();
    this.region.drawWorldBackground(this.region.context)
    this.region.drawGroundItems(this.region.context)

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

    this.region.context.restore();
  }

  draw () {
    this.viewport.context.globalAlpha = 1
    this.viewport.context.fillStyle = '#3B3224'

    this.viewport.context.restore()
    this.viewport.context.save()
    this.viewport.context.fillStyle = '#3B3224'

    this.viewport.context.fillRect(0, 0, this.viewport.canvas.width, this.viewport.canvas.height)

    if (Settings.rotated === 'south') {
      this.viewport.context.translate(-this.mapController.width, 0);
      this.viewport.context.rotate(Math.PI)
      this.viewport.context.translate(-this.viewport.canvas.width, -this.viewport.canvas.height)
    }

    this.drawWorld(this.tickPercent)

    const { viewportX, viewportY } = this.viewport.getViewport(this);

    this.viewport.context.drawImage(this.region.canvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);

    this.viewport.context.restore()
    this.viewport.context.save();

    // draw control panel
    this.viewport.context.translate(this.viewport.canvas.width - this.controlPanel.width, this.viewport.canvas.height - this.controlPanel.height)
    this.controlPanel.draw(this)

    this.viewport.context.restore();

    XpDropController.controller.draw(this.viewport.context, this.viewport.canvas.width - 140 - this.mapController.width, 0, this.tickPercent);
    MapController.controller.draw(this.viewport.context, this.tickPercent);


    this.contextMenu.draw(this)

    if (this.viewport.clickController.clickAnimation) {
      this.viewport.clickController.clickAnimation.draw(this, this.tickPercent)
    }

    this.viewport.context.restore()
    this.viewport.context.save()

    this.viewport.context.textAlign = 'left'
    if (this.getReadyTimer > 0) {
      this.viewport.context.font = '72px OSRS'
      this.viewport.context.textAlign = 'center'
      this.viewport.context.fillStyle = '#000'
      this.viewport.context.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.canvas.width / 2 - 2, this.viewport.canvas.height / 2 - 50)
      this.viewport.context.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.canvas.width / 2 + 2, this.viewport.canvas.height / 2 - 50)
      this.viewport.context.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.canvas.width / 2, this.viewport.canvas.height / 2 - 48)
      this.viewport.context.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.canvas.width / 2, this.viewport.canvas.height / 2 - 52)

      this.viewport.context.fillStyle = '#FFFFFF'
      this.viewport.context.fillText(`GET READY...${this.getReadyTimer}`, this.viewport.canvas.width / 2, this.viewport.canvas.height / 2 - 50)
      this.viewport.context.textAlign = 'left'
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
    if (this.tickCounter === 0) {
      this.mobs.push(mob)
    }else{
      this.newMobs.push(mob)
    }
  }

  removeMob (mob: Unit) {
    remove(this.mobs, mob)
  }

}
