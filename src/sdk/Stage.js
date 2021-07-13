'use strict';
import _ from 'lodash';
import ClickAnimation from './ClickAnimation';
import Constants from "./Constants";
import ControlPanelController from './ControlPanelController';
import Pathing from './Pathing';


export default class Stage {

  constructor(selector, width, height) {
    this.inputDelay = null;
    this.frameCounter = 0;
    this.heldDown = 6;
    this.controlPanel = null;
    this.player = null;
    this.entities = [];
    this.mobs = [];
    this.clickAnimation = null;

    this.map = document.getElementById(selector);
    this.ctx = this.map.getContext("2d");
    this.map.width = Constants.tileSize * width;
    this.map.height = Constants.tileSize * height;

    this.grid = document.getElementById("grid");
    this.gridCtx = this.grid.getContext("2d");
    this.grid.width = Constants.tileSize * width;
    this.grid.height = Constants.tileSize * height;
    this.hasCalcedGrid = false;


    this.width = width;
    this.height = height;

    this.offPerformanceDelta = 0;
    this.offPerformanceCount = 0;

    this.map.addEventListener('mousedown', this.mapClick.bind(this));
  }

  getContext() {
    return this.ctx;
  }

  setPlayer(player) {
    this.player = player;
  }

  setControlPanel(controlPanel){
    this.controlPanel = controlPanel;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    _.remove(this.entities, entity);
  }

  addMob(mob) {
    this.mobs.push(mob);
  }

  removeMob(mob) {
    _.remove(this.mobs, mob);
  }

  startTicking() {
    setInterval(this.gameLoop.bind(this), Constants.tickMs / Constants.framesPerTick); 
  }

  gameLoop() {
    let t = performance.now();
    if (this.frameCounter === 0 && this.heldDown <=0) {
      this.timeBetweenTicks = t - this.lastT;
      this.lastT = t;

      // // Calculate Time Between Tick Off Performance and adjust framerate accordingly
      // if (isNaN(this.timeBetweenTicks) === false){
      //   const offPerformance = 600 - this.timeBetweenTicks;
      //   this.offPerformanceDelta += offPerformance;
      //   this.offPerformanceCount++;
      //   if (this.offPerformanceCount > 5){
      //     const delta = this.offPerformanceDelta / this.offPerformanceCount / 10;
      //     if (delta > 0){
      //       Constants.framesPerTick += Math.floor(delta);
      //     }else{
      //       Constants.framesPerTick += Math.ceil(delta);
      //     }          
      //     this.offPerformanceCount = 0;
      //     this.offPerformanceDelta = 0;
      //   }
      // }

      this.player.setPrayers(ControlPanelController.controls.PRAYER.getCurrentActivePrayers());

      this.entities.forEach((entity) => entity.tick(this));

      this.mobs.forEach((mob) => mob.movementStep(this));
      this.mobs.forEach((mob) => mob.attackStep(this));

      this.player.movementStep(this);
      this.player.attackStep(this);


      // Safely remove the mobs from the stage. If we do it while iterating we can cause ticks to be stole'd
      const deadMobs = this.mobs.filter((mob) => mob.dying === 0);
      const deadEntities = this.entities.filter((mob) => mob.dying === 0);
      deadMobs.forEach((mob) => this.removeMob(mob));
      deadEntities.forEach((entity) => this.removeEntity(entity));

      this.tickTime = performance.now() - t;
    }
    let t2 = performance.now();
    this.draw(this.frameCounter / Constants.framesPerTick);
    this.drawTime = performance.now() - t2;
    this.frameCounter++;
    if (this.frameCounter >= Constants.framesPerTick) {
      this.fps = this.frameCounter / this.timeBetweenTicks * 1000;
      this.frameCounter = 0;
    }
    this.frameTime = performance.now() - t;
  }

  mapClick(e) {
    const framePercent = this.frameCounter / Constants.framesPerTick;

    let x = e.offsetX;
    let y = e.offsetY;
    if (this.inputDelay){
      clearTimeout(this.inputDelay);
    }
    this.inputDelay = setTimeout(() => {
      // maybe this should live in the player class? seems very player related in current form.
      this.player.seeking = false;
      const mob = Pathing.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, framePercent);
      if (mob) {
        this.clickAnimation = new ClickAnimation('red', x, y);
        this.player.seeking = mob;
      }else {
        this.clickAnimation = new ClickAnimation('yellow', x, y);
        this.player.moveTo(Math.floor(x / Constants.tileSize), Math.floor(y / Constants.tileSize));
      }
    }, 150);
  }

  draw(framePercent) {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "black";

    this.controlPanel.draw(this);

    if (!this.hasCalcedGrid){
      // This is a GIGANTIC performance improvement ... 
      this.gridCtx.fillRect(0, 0, this.map.width, this.map.height);
      for (var i = 0; i < this.map.width * this.map.height; i++) {
        this.gridCtx.fillStyle = (i % 2) ? "#100" : "#210";
        this.gridCtx.fillRect(
          i % this.width * Constants.tileSize, 
          Math.floor(i / this.width) * Constants.tileSize, 
          Constants.tileSize, 
          Constants.tileSize
        );
      }
      this.hasCalcedGrid = true;
    }

    this.ctx.drawImage(this.grid, 0, 0);
    // Draw all things on the map
    this.entities.forEach((entity) => entity.draw(this, framePercent));

    if (this.heldDown <= 0){
      this.mobs.forEach((mob) => mob.draw(this, framePercent));
    }
    this.player.draw(this, framePercent);
    
    if (this.clickAnimation) {
      this.clickAnimation.draw(this, framePercent)
    }
    
    // Performance info
    this.ctx.fillStyle = "#FFFF0066";
    this.ctx.font = "16px OSRS";
    this.ctx.fillText(`FPS: ${Math.round(this.fps * 100) / 100}`, 0, 16);
    this.ctx.fillText(`DFR: ${Constants.framesPerTick * (1 / 0.6)}`, 0, 32);
    this.ctx.fillText(`TBT: ${Math.round(this.timeBetweenTicks)}ms`, 0, 48);
    this.ctx.fillText(`TT: ${Math.round(this.tickTime)}ms`, 0, 64);
    this.ctx.fillText(`FT: ${Math.round(this.frameTime)}ms`, 0, 80);
    this.ctx.fillText(`DT: ${Math.round(this.drawTime)}ms`, 0, 96);
    this.ctx.fillText(`Wave: ${this.wave}`, 0, 112);

    if (this.heldDown){

      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "72px OSRS";
      this.ctx.textAlign="center";
      this.ctx.fillText(`GET READY...${this.heldDown}`, this.map.width / 2, this.map.height / 2 - 50);
      this.ctx.textAlign="left";
  
    }
  }
}
