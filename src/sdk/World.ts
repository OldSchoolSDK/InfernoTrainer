'use strict'
import { Settings } from './Settings'
import { XpDropController } from './XpDropController'
import { Player } from './Player'
import { Region } from './Region'
import { DelayedAction } from './DelayedAction'
import { Viewport } from './Viewport'
import { InfernoRegion } from '../content/inferno/js/InfernoRegion'
import MetronomeSound from '../assets/sounds/bonk.ogg'
import { Pathing } from './Pathing'


export class World {

  tickCounter = 0;
  isPaused = true;
  tickPercent: number;
  getReadyTimer = 0;
  deltaTimeSincePause = -1;
  deltaTimeSinceLastTick = -1;
  lastMenuVisible: boolean;
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
    }

    if (elapsed > this.fpsInterval && this.isPaused === false) {
      this.tickPercent = (window.performance.now() - this.tickTimer) / Settings.tickMs;
      this.then = now - (elapsed % this.fpsInterval);
      Viewport.viewport.draw(this);
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
    XpDropController.controller.tick();


    // Safely remove the mobs from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = region.mobs.filter((mob) => mob.dying === 0)
    const deadEntities = region.entities.filter((mob) => mob.dying === 0)
    deadMobs.forEach((mob) => region.removeMob(mob))
    deadEntities.forEach((entity) => region.removeEntity(entity))

    if (n > 1) {
      return this.worldTick(region, player, n-1);
    }

  }



}
