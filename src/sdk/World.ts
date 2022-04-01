'use strict'
import { Settings } from './Settings'
import { ContextMenu, MenuOption } from './ContextMenu'
import { ControlPanelController } from './ControlPanelController'
import { XpDropController } from './XpDropController'
import { Player } from './Player'
import { Region } from './Region'
import { MapController } from './MapController'
import { DelayedAction } from './DelayedAction'
import { Viewport } from './Viewport'
import { InfernoRegion } from '../content/inferno/js/InfernoRegion'
import MetronomeSound from '../assets/sounds/bonk.ogg'
import { Pathing } from './Pathing'
import { ImageLoader } from './utils/ImageLoader'
import ButtonActiveIcon from '../assets/images/interface/button_active.png'
import { Chrome } from './Chrome'


export class World {
  viewport: Viewport;
  region: Region;
  player?: Player;

  activeButtonImage: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon)

  controlPanel: ControlPanelController;
  mapController: MapController;
  contextMenu: ContextMenu = new ContextMenu();

  tickCounter: number = 0;
  isPaused: boolean = true;
  tickPercent: number;

  getReadyTimer: number = 6
  
  deltaTimeSincePause: number = -1;
  deltaTimeSinceLastTick: number = -1;

  _serialNumber: string;

  lastMenuVisible: boolean;

  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random())
    }
    return this._serialNumber;
  }

  constructor (region: Region, mapController: MapController, controlPanel: ControlPanelController, ) {

    this.region = region;
    this.mapController = mapController;
    this.controlPanel = controlPanel;
    this.controlPanel.setWorld(this);
    this.mapController.setWorld(this)
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
      this.worldTick();

    }

    if (elapsed > this.fpsInterval && this.isPaused === false) {
      this.tickPercent = (window.performance.now() - this.tickTimer) / Settings.tickMs;
      this.then = now - (elapsed % this.fpsInterval);
      this.draw();
      this.frameCount ++;
    }

    if (Settings.menuVisible !== this.lastMenuVisible) {
      if (Settings.menuVisible) {
        document.getElementById('right_panel').classList.remove('hidden');
      }else{
        document.getElementById('right_panel').classList.add('hidden');
      }
      this.viewport.initializeViewport(this);
    }
    this.lastMenuVisible = Settings.menuVisible;
  }

  worldTick () {
    Pathing.purgeTileCache();
    this.tickCounter++;

    if (Settings.metronome) {
      new Audio(MetronomeSound).play();
    }
    
    // TODO: Clean up this since its now region based
    if (this.region.newMobs.length){
      this.region.mobs.unshift(...this.region.newMobs)
      this.region.newMobs = [];
    }
    XpDropController.controller.tick();

    this.player.pretick();
    
    this.region.entities.forEach((entity) => entity.tick())

    if (this.getReadyTimer <=0){

      // hack hack hack
      const infernoRegion = this.region as InfernoRegion;

      if (infernoRegion.wave !== 0){

        this.region.mobs.forEach((mob) => {
          mob.ticksAlive++;
          mob.movementStep()
        })
        this.region.mobs.forEach((mob) => mob.attackStep())
  
  
        this.region.newMobs.forEach((mob) => {
          mob.ticksAlive++;
          mob.movementStep()
        })
        this.region.newMobs.forEach((mob) => mob.attackStep())
  
      }
    }

    this.player.movementStep()
    this.player.ticksAlive++;
    this.player.attackStep()
    DelayedAction.tick();


    // Safely remove the mobs from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = this.region.mobs.filter((mob) => mob.dying === 0)
    const deadEntities = this.region.entities.filter((mob) => mob.dying === 0)
    deadMobs.forEach((mob) => this.region.removeMob(mob))
    deadEntities.forEach((entity) => this.region.removeEntity(entity))

  }

  drawWorld (tickPercent: number) {
    this.region.context.save();
    this.region.drawWorldBackground(this.region.context)
    this.region.drawGroundItems(this.region.context)

    // Draw all things on the map
    this.region.entities.forEach((entity) => entity.draw(tickPercent))

    if (this.getReadyTimer <= 0) {
      this.region.mobs.forEach((mob) => mob.draw(tickPercent))
      this.region.newMobs.forEach((mob) => mob.draw(tickPercent))
    }
    this.player.draw(tickPercent)

    this.region.entities.forEach((entity) => entity.drawUILayer(tickPercent))

    if (this.getReadyTimer <= 0) {
      this.region.mobs.forEach((mob) => mob.drawUILayer(tickPercent))
    }
    this.player.drawUILayer(tickPercent)

    this.region.context.restore();
  }

  draw () {
    this.viewport.context.globalAlpha = 1
    this.viewport.context.fillStyle = '#3B3224'
    this.viewport.context.restore()
    this.viewport.context.save()
    this.viewport.context.fillStyle = 'black'
    this.viewport.context.fillRect(0, 0, 10000000, 1000000)

    let { width, height } = Chrome.size();


    if (Settings.rotated === 'south') {
      this.viewport.context.rotate(Math.PI)



      this.viewport.context.translate(-width, -height);
    }
    this.drawWorld(this.tickPercent)
    const { viewportX, viewportY } = this.viewport.getViewport(this);
    this.viewport.context.drawImage(this.region.canvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);
    this.viewport.context.restore()
    this.viewport.context.save();

    if (Settings.mobileCheck()) {
      this.viewport.context.fillStyle = '#FFFF00'
      this.viewport.context.font = (16) + 'px OSRS'
      this.viewport.context.textAlign = 'center'

      this.viewport.context.drawImage(this.activeButtonImage, 20, 20, this.activeButtonImage.width, this.activeButtonImage.height)
      this.viewport.context.fillText('RESET', 40, 45)

    }

    // draw control panel
    this.controlPanel.draw(this)
    // this.viewport.context.restore();
    XpDropController.controller.draw(this.viewport.context, width - 140 - this.mapController.width, 0, this.tickPercent);
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
      this.drawVPText(`GET READY...${this.getReadyTimer}`, width / 2, height / 2 - 50)
    }

    const region = this.region as InfernoRegion; // HACK HACK
    if (region.wave > 69 && region.wave < 74) {
      this.viewport.context.font = '24px OSRS'
      this.viewport.context.textAlign = 'left'

      this.drawVPText(`Mode: ${this.modeName(region.wave)}`, 6, height - 50)
      this.drawVPText(`Score: ${region.score}`, 6, height - 24)


      if (region.finalScore === -1 && document.body.style.background === 'red') {
        region.finalScore = region.score;
      }
      if (region.finalScore !== -1) {
        this.viewport.context.font = '24px OSRS'
        this.viewport.context.textAlign = 'left'
        this.drawVPText(`Final Score: ${region.finalScore}`, 6, height)
      }
        
    }

  }


  modeName(wave: number): string {
    switch (wave){
      case 70:
        return 'Easy';
      case 71:
        return 'Hard';
      case 72:
        return 'Hell';
      case 73:
        return 'WTF';
    }
    return String(wave);
  }

  drawVPText(text: string, x: number, y: number) {

    x = Math.floor(x);
    y = Math.floor(y);
    this.viewport.context.fillStyle = '#000'
    this.viewport.context.fillText(text, x - 2, y - 2)
    this.viewport.context.fillText(text, x + 2, y - 2)
    this.viewport.context.fillText(text, x, y)
    this.viewport.context.fillText(text, x, y - 4)
    this.viewport.context.fillStyle = '#FFFFFF'
    this.viewport.context.fillText(text, x, y - 2)
  }

  setPlayer (player: Player) {
    this.player = player
  }
}
