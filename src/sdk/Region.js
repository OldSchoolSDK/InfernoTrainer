'use strict';
import _ from 'lodash';
import { ClickAnimation } from './ClickAnimation';
import { Settings } from "./Settings";
import { ContextMenu } from './ContextMenu';
import { ControlPanelController } from './ControlPanelController';
import { Pathing } from './Pathing';


export class Region {

  constructor(selector, width, height) {
    this.inputDelay = null;
    this.frameCounter = 0;
    this.heldDown = 6;
    this.controlPanel = null;
    this.player = null;
    this.entities = [];
    this.mobs = [];
    this.clickAnimation = null;
    this.contextMenu = new ContextMenu();

    this.map = document.getElementById(selector);
    this.ctx = this.map.getContext("2d");
    this.map.width = Settings.tileSize * width;
    this.map.height = Settings.tileSize * height;

    this.grid = document.getElementById("grid");
    this.gridCtx = this.grid.getContext("2d");
    this.grid.width = Settings.tileSize * width;
    this.grid.height = Settings.tileSize * height;
    this.hasCalcedGrid = false;


    this.width = width;
    this.height = height;

    this.offPerformanceDelta = 0;
    this.offPerformanceCount = 0;

    this.map.addEventListener('click', this.mapClick.bind(this));
    this.map.addEventListener('contextmenu', (e) =>{
      


      let x = e.offsetX;
      let y = e.offsetY;

      this.contextMenu.setPosition({x, y});
      if (Settings.rotated === 'south') {
        x = this.width * Settings.tileSize - e.offsetX;
        y = this.height * Settings.tileSize - e.offsetY;
      }
  
    
      /*gather options */
      const mobs = Pathing.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, this.frameCounter / Settings.framesPerTick);
      let menuOptions = [];
      mobs.forEach((mob) => {
        menuOptions = menuOptions.concat(mob.contextActions(this, x, y))
      })
      this.contextMenu.setMenuOptions(menuOptions);
      this.contextMenu.setActive();
    });

    this.map.addEventListener("mousemove", (e) => {      
      const x = e.clientX;
      const y = e.clientY;
      this.contextMenu.cursorMovedTo(this, x, y);
    })
  }

  mapClick(e) {
    const framePercent = this.frameCounter / Settings.framesPerTick;


    let x = e.offsetX;
    let y = e.offsetY;
    if (Settings.rotated === 'south') {
      x = this.width * Settings.tileSize - e.offsetX;
      y = this.height * Settings.tileSize - e.offsetY;
    }

    const xAlign = this.contextMenu.location.x - (this.contextMenu.width / 2) < e.offsetX && e.offsetX < this.contextMenu.location.x + this.contextMenu.width / 2;
    const yAlign = this.contextMenu.location.y < e.offsetY && e.offsetY < this.contextMenu.location.y + this.contextMenu.height;

    if (this.contextMenu.isActive && xAlign && yAlign) {
      this.contextMenu.clicked(this, e.offsetX, e.offsetY);
    } else {
      if (this.inputDelay){
        clearTimeout(this.inputDelay);
      }

      const mobs = Pathing.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, framePercent);
      this.player.aggro = false;
      if (mobs.length) {
        this.redClick();
        this.playerAttackClick(mobs[0])
      }else {
        this.yellowClick();
        this.playerWalkClick(x, y);
      }
      
    }
    this.contextMenu.setInactive();

  }

  playerAttackClick(mob) {
    this.inputDelay = setTimeout(() => {
      this.player.aggro = mob;
    }, Settings.inputDelay);
  }
  
  playerWalkClick(x, y) {
    this.inputDelay = setTimeout(() => {
      this.player.moveTo(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize));
    }, Settings.inputDelay);
  }

  redClick() {
    this.clickAnimation = new ClickAnimation('red', this.contextMenu.cursorPosition.x, this.contextMenu.cursorPosition.y);
  }
  yellowClick() {
    this.clickAnimation = new ClickAnimation('yellow', this.contextMenu.cursorPosition.x, this.contextMenu.cursorPosition.y);
  }

  gameTick() {
    this.player.setPrayers(ControlPanelController.controls.PRAYER.getCurrentActivePrayers());
    this.entities.forEach((entity) => entity.tick(this));
    this.mobs.forEach((mob) => mob.movementStep(this));
    this.mobs.forEach((mob) => mob.attackStep(this));
    this.player.movementStep(this);
    this.player.attackStep(this);
    
    // Safely remove the mobs from the region. If we do it while iterating we can cause ticks to be stole'd
    const deadMobs = this.mobs.filter((mob) => mob.dying === 0);
    const deadEntities = this.entities.filter((mob) => mob.dying === 0);
    deadMobs.forEach((mob) => this.removeMob(mob));
    deadEntities.forEach((entity) => this.removeEntity(entity));
  }

  drawGame(framePercent) {
    // Give control panel a chance to draw, canvas -> canvas 
    this.controlPanel.draw(this);

    // Draw all things on the map
    this.entities.forEach((entity) => entity.draw(this, framePercent));

    if (this.heldDown <= 0){
      this.mobs.forEach((mob) => mob.draw(this, framePercent));
    }
    this.player.draw(this, framePercent);
    
    this.ctx.restore();


    this.contextMenu.draw(this);
    if (this.clickAnimation) {
      this.clickAnimation.draw(this, framePercent)
    }
  }

  gameLoop() {
    // Runs a tick every 600 ms (when frameCounter = 0), and draws every loop
    // Everything else is just measuring performance
    let t = performance.now();
    if (this.frameCounter === 0 && this.heldDown <=0) {
      this.timeBetweenTicks = t - this.lastT;
      this.lastT = t;
      this.gameTick();
      this.tickTime = performance.now() - t;
    }
    let t2 = performance.now();
    this.draw(this.frameCounter / Settings.framesPerTick);
    this.drawTime = performance.now() - t2;
    this.frameCounter++;
    if (this.frameCounter >= Settings.framesPerTick) {
      this.fps = this.frameCounter / this.timeBetweenTicks * 1000;
      this.frameCounter = 0;
    }
    this.frameTime = performance.now() - t;
  }
  draw(framePercent) {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "black";

    this.ctx.restore();
    this.ctx.save();
    if (Settings.rotated === 'south'){
      this.ctx.rotate(Math.PI);
      this.ctx.translate(-this.map.width, -this.map.height)  
    }

    if (!this.hasCalcedGrid){
      // This is a GIGANTIC performance improvement ... 
      this.gridCtx.fillRect(0, 0, this.map.width, this.map.height);
      for (var i = 0; i < this.map.width * this.map.height; i++) {
        this.gridCtx.fillStyle = (i % 2) ? "#100" : "#210";
        this.gridCtx.fillRect(
          i % this.width * Settings.tileSize, 
          Math.floor(i / this.width) * Settings.tileSize, 
          Settings.tileSize, 
          Settings.tileSize
        );
      }
      this.hasCalcedGrid = true;
    }

    this.ctx.drawImage(this.grid, 0, 0);
    this.drawGame(framePercent);
    
    this.ctx.restore();
    this.ctx.save();
    
    // Performance info
    this.ctx.fillStyle = "#FFFF0066";
    this.ctx.font = "16px OSRS";
    this.ctx.fillText(`FPS: ${Math.round(this.fps * 100) / 100}`, 0, 16);
    this.ctx.fillText(`DFR: ${Settings.framesPerTick * (1 / 0.6)}`, 0, 32);
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
    setInterval(this.gameLoop.bind(this), Settings.tickMs / Settings.framesPerTick); 
  }
}
