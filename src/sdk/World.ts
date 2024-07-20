"use strict";
import { Settings } from "./Settings";
import { XpDropController } from "./XpDropController";
import { Player } from "./Player";
import { Region } from "./Region";
import { DelayedAction } from "./DelayedAction";
import { Viewport } from "./Viewport";
import MetronomeSound from "../assets/sounds/bonk.ogg";
import { Pathing } from "./Pathing";
import { EventBus } from "./EventBus";

export class World {
  regions: Region[] = [];
  globalTickCounter = 0;
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
  eventBus: EventBus = new EventBus();

  addRegion(region: Region) {
    this.regions.push(region);
  }

  startTicking() {
    this.isPaused = false;
    if (this.deltaTimeSincePause === -1) {
      this.tickTimer = window.performance.now();
      this.then = window.performance.now();
    } else {
      this.then = window.performance.now() - this.deltaTimeSincePause;

      this.tickTimer = window.performance.now() - this.deltaTimeSinceLastTick;

      this.deltaTimeSincePause = -1;
    }
    this.browserLoop(window.performance.now());
  }

  stopTicking() {
    this.deltaTimeSincePause = window.performance.now() - this.then;
    this.deltaTimeSinceLastTick = window.performance.now() - this.tickTimer;
    this.isPaused = true;
  }

  browserLoop(now: number) {
    window.requestAnimationFrame(this.browserLoop.bind(this));
    const elapsed = now - this.then;
    const tickElapsed = now - this.tickTimer;
    if (tickElapsed >= 600 && this.isPaused === false) {
      this.tickTimer = now;
      if (this.getReadyTimer > 0) {
        this.getReadyTimer--;
      }

      this.tickWorld();
    }

    if (elapsed > this.fpsInterval && this.isPaused === false) {
      this.tickPercent = (window.performance.now() - this.tickTimer) / Settings.tickMs;
      this.then = now - (elapsed % this.fpsInterval);
      Viewport.viewport.draw(this);
      this.frameCount++;
    }
  }

  tickWorld(n = 1) {
    this.globalTickCounter++;
    this.regions.forEach((region: Region) => this.tickRegion(region));

    if (n > 1) {
      return this.tickWorld(n - 1);
    }
  }

  tickRegion(region: Region) {
    Pathing.purgeTileCache();

    if (Settings.metronome) {
      new Audio(MetronomeSound).play();
    }

    // TODO: Clean up this since its now region based
    if (region.newMobs.length) {
      region.mobs.unshift(...region.newMobs);
      region.newMobs = [];
    }

    region.players.forEach((player: Player) => player.pretick());

    region.entities.forEach((entity) => entity.tick());

    if (this.getReadyTimer == 0) {
      region.mobs.forEach((mob) => {
        mob.movementStep();
      });
      region.mobs.forEach((mob) => mob.attackStep());

      region.newMobs.forEach((mob) => {
        mob.movementStep();
      });
      region.newMobs.forEach((mob) => mob.attackStep());
    }

    region.players.forEach((player: Player) => {
      player.movementStep();
      if (this.getReadyTimer <= 0) {
        player.attackStep();
      }
    });

    region.midTick();
    DelayedAction.tick();
    XpDropController.controller.tick();
    Viewport.viewport.tick();

    region.postTick();

    // Safely remove the dead stuff from the world. If we do it while iterating we can cause ticks to be stole'd
    const deadPlayers = region.players.filter((player) => player.dying === 0);
    const deadMobs = region.mobs.filter((mob) => mob.dying === 0);
    const deadEntities = region.entities.filter((mob) => mob.dying === 0);
    deadPlayers.forEach((player) => region.removePlayer(player));
    deadMobs.forEach((mob) => region.removeMob(mob));
    deadEntities.forEach((entity) => region.removeEntity(entity));
  }
}
