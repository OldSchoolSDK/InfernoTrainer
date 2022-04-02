'use strict'
import { Settings } from './Settings'
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

  activeButtonImage: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon)
  tickCounter = 0;
  isPaused = true;
  tickPercent: number;

  getReadyTimer = 0;
  
  deltaTimeSincePause = -1;
  deltaTimeSinceLastTick = -1;

  _serialNumber: string;

  lastMenuVisible: boolean;

  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random())
    }
    return this._serialNumber;
  }

  fpsInterval = 1000 / Settings.fps;
  then: number;
  startTime: number;
  frameCount = 0;
  tickTimer = 0;
  startTicking (region: Region, player: Player) {
    this.isPaused = false;
    if (this.deltaTimeSincePause === -1) {
      this.tickTimer = window.performance.now();
      this.then = window.performance.now();
    }else{
      this.then = window.performance.now() - this.deltaTimeSincePause;

      this.tickTimer = window.performance.now() - this.deltaTimeSinceLastTick;

      this.deltaTimeSincePause = -1;
    }
    this.browserLoop(region, player, window.performance.now());
  }

  stopTicking() {
    this.deltaTimeSincePause = window.performance.now() - this.then;
    this.deltaTimeSinceLastTick = window.performance.now() - this.tickTimer;
    this.isPaused = true;
  }

  browserLoop (region: Region, player: Player, now: number) {
    window.requestAnimationFrame(this.browserLoop.bind(this, region, player));


    const elapsed = now - this.then;

    const tickElapsed = now - this.tickTimer;

    if (tickElapsed >= 600 && this.isPaused === false) {
      this.tickTimer = now;
      this.getReadyTimer--;
      this.worldTick(region, player, 1);
      XpDropController.controller.tick();
    }

    if (elapsed > this.fpsInterval && this.isPaused === false) {
      this.tickPercent = (window.performance.now() - this.tickTimer) / Settings.tickMs;
      this.then = now - (elapsed % this.fpsInterval);
      this.draw(region);
      this.frameCount ++;
    }

    // TODO: Move out of here.
    if (Settings.menuVisible !== this.lastMenuVisible) {
      if (Settings.menuVisible) {
        document.getElementById('right_panel').classList.remove('hidden');
      }else{
        document.getElementById('right_panel').classList.add('hidden');
      }
      Viewport.viewport.calculateViewport();
    }
    this.lastMenuVisible = Settings.menuVisible;
  }

  worldTick (region: Region, player: Player, n = 1) {
    Pathing.purgeTileCache();
    this.tickCounter++;

    if (Settings.metronome) {
      new Audio(MetronomeSound).play();
    }
    
    // TODO: Clean up this since its now region based
    if (region.newMobs.length){
      region.mobs.unshift(...region.newMobs)
      region.newMobs = [];
    }


    player.pretick();
    
    region.entities.forEach((entity) => entity.tick())

    if (this.getReadyTimer <=0){

      // hack hack hack
      const infernoRegion = region as InfernoRegion;

      if (infernoRegion.wave !== 0){

        region.mobs.forEach((mob) => {
          mob.ticksAlive++;
          mob.movementStep()
        })
        region.mobs.forEach((mob) => mob.attackStep())
  
  
        region.newMobs.forEach((mob) => {
          mob.ticksAlive++;
          mob.movementStep()
        })
        region.newMobs.forEach((mob) => mob.attackStep())
  
      }
    }

    player.movementStep()
    player.ticksAlive++;
    player.attackStep()
    DelayedAction.tick();


    // Safely remove the mobs from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = region.mobs.filter((mob) => mob.dying === 0)
    const deadEntities = region.entities.filter((mob) => mob.dying === 0)
    deadMobs.forEach((mob) => region.removeMob(mob))
    deadEntities.forEach((entity) => region.removeEntity(entity))

    if (n > 1) {
      return this.worldTick(region, player, n-1);
    }

  }

  drawWorld (region: Region, player: Player, tickPercent: number) {
    region.context.save();
    region.drawWorldBackground(region.context)
    region.drawGroundItems(region.context)

    // Draw all things on the map
    region.entities.forEach((entity) => entity.draw(tickPercent))

    if (this.getReadyTimer <= 0) {
      region.mobs.forEach((mob) => mob.draw(tickPercent))
      region.newMobs.forEach((mob) => mob.draw(tickPercent))
    }
    player.draw(tickPercent)

    region.entities.forEach((entity) => entity.drawUILayer(tickPercent))

    if (this.getReadyTimer <= 0) {
      region.mobs.forEach((mob) => mob.drawUILayer(tickPercent))
    }
    player.drawUILayer(tickPercent)

    region.context.restore();
  }

  draw (_region: Region) {
    Viewport.viewport.context.globalAlpha = 1
    Viewport.viewport.context.fillStyle = '#3B3224'
    Viewport.viewport.context.restore()
    Viewport.viewport.context.save()
    Viewport.viewport.context.fillStyle = 'black'
    Viewport.viewport.context.fillRect(0, 0, 10000000, 1000000)

    const { width, height } = Chrome.size();


    if (Settings.rotated === 'south') {
      Viewport.viewport.context.rotate(Math.PI)



      Viewport.viewport.context.translate(-width, -height);
    }
    this.drawWorld(_region, Viewport.viewport.player, this.tickPercent)
    const { viewportX, viewportY } = Viewport.viewport.getViewport(this.tickPercent);
    Viewport.viewport.context.drawImage(_region.canvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);
    Viewport.viewport.context.restore()
    Viewport.viewport.context.save();

    if (Settings.mobileCheck()) {
      Viewport.viewport.context.fillStyle = '#FFFF00'
      Viewport.viewport.context.font = (16) + 'px OSRS'
      Viewport.viewport.context.textAlign = 'center'

      Viewport.viewport.context.drawImage(this.activeButtonImage, 20, 20, this.activeButtonImage.width, this.activeButtonImage.height)
      Viewport.viewport.context.fillText('RESET', 40, 45)

    }

    // draw control panel
    ControlPanelController.controller.draw()
    // this.viewport.context.restore();
    XpDropController.controller.draw(Viewport.viewport.context, width - 140 - MapController.controller.width, 0, this.tickPercent);
    MapController.controller.draw(Viewport.viewport.context);
    Viewport.viewport.contextMenu.draw()

    if (Viewport.viewport.clickController.clickAnimation) {
      Viewport.viewport.clickController.clickAnimation.draw()
    }

    Viewport.viewport.context.restore()
    Viewport.viewport.context.save()

    Viewport.viewport.context.textAlign = 'left'
    if (this.getReadyTimer > 0) {
      Viewport.viewport.context.font = '72px OSRS'
      Viewport.viewport.context.textAlign = 'center'
      Viewport.viewport.drawText(`GET READY...${this.getReadyTimer}`, width / 2, height / 2 - 50)
    }

    const region = _region as InfernoRegion; // HACK HACK
    if (region.wave > 69 && region.wave < 74) {
      Viewport.viewport.context.font = '24px OSRS'
      Viewport.viewport.context.textAlign = 'left'

      Viewport.viewport.drawText(`Mode: ${this.modeName(region.wave)}`, 6, height - 50)
      Viewport.viewport.drawText(`Score: ${region.score}`, 6, height - 24)


      if (region.finalScore === -1 && document.body.style.background === 'red') {
        region.finalScore = region.score;
      }
      if (region.finalScore !== -1) {
        Viewport.viewport.context.font = '24px OSRS'
        Viewport.viewport.context.textAlign = 'left'
        Viewport.viewport.drawText(`Final Score: ${region.finalScore}`, 6, height)
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
}
