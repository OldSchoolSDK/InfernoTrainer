'use strict'
import { remove } from 'lodash'
import { ClickAnimation } from './ClickAnimation'
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
import { Collision } from './Collision'
import { Item } from './Item'
import { Viewport } from './Viewport'

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
  worldCanvas: OffscreenCanvas;
  viewport: Viewport = new Viewport();
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

  newMobs: Mob[] = [];


  tickCounter: number = 0;

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

    this.viewport = Viewport.createViewport(this, selector);

    this.registerClickActions();

  }

  registerClickActions() {
    this.viewport.canvas.addEventListener('mousedown', this.leftClickDown.bind(this))
    this.viewport.canvas.addEventListener('mouseup', this.leftClickUp.bind(this))
    this.viewport.canvas.addEventListener('mousemove', (e: MouseEvent) => this.controlPanel.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', (e: MouseEvent) => this.mapController.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', (e) => this.contextMenu.cursorMovedTo(this, e.clientX, e.clientY))
    this.viewport.canvas.addEventListener('contextmenu', this.rightClick.bind(this));
  }

  leftClickUp (e: MouseEvent) {

    if (e.button !== 0) {
      return;
    }
    const { viewportX, viewportY } = this.viewport.getViewport(this);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    // if (e.offsetX > this.viewportWidth * Settings.tileSize) {
    //   if (e.offsetY < this.mapController.height) {
    //     const intercepted = this.mapController.clicked(e);
    //     if (intercepted) {
    //       return;
    //     }
    //   }
    // }


    const xAlign = this.contextMenu.location.x - (this.contextMenu.width / 2) < e.offsetX && e.offsetX < this.contextMenu.location.x + this.contextMenu.width / 2
    const yAlign = this.contextMenu.location.y < e.offsetY && e.offsetY < this.contextMenu.location.y + this.contextMenu.height


    if (e.offsetX > this.viewport.canvas.width - this.controlPanel.width) {
      if (e.offsetY > this.viewport.width * Settings.tileSize - this.controlPanel.height){
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
    const { viewportX, viewportY } = this.viewport.getViewport(this);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    } 

    const xAlign = this.contextMenu.location.x - (this.contextMenu.width / 2) < e.offsetX && e.offsetX < this.contextMenu.location.x + this.contextMenu.width / 2
    const yAlign = this.contextMenu.location.y < e.offsetY && e.offsetY < this.contextMenu.location.y + this.contextMenu.height

    if (this.contextMenu.isActive && xAlign && yAlign) {
      this.contextMenu.clicked(this, e.offsetX, e.offsetY)
      this.contextMenu.setInactive();
      return;
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < this.mapController.height) {
        const intercepted = this.mapController.leftClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (e.offsetX > this.viewport.canvas.width - this.controlPanel.width) {
      if (e.offsetY > this.viewport.width * Settings.tileSize - this.controlPanel.height){
        const intercepted = this.controlPanel.controlPanelClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }


    if (this.inputDelay) {
      clearTimeout(this.inputDelay)
    }

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, this.tickPercent)
    const groundItems = this.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize));

    this.player.setAggro(null)
    if (mobs.length && mobs[0].canBeAttacked()) {
      this.redClick()
      this.playerAttackClick(mobs[0])
    } else if (groundItems.length){
      this.redClick()
      this.player.setSeekingItem(groundItems[0])
    } else {
      this.yellowClick()
      this.playerWalkClick(x, y)
    }
    this.contextMenu.setInactive()
  }
  rightClick (e: MouseEvent) {
    

    const { viewportX, viewportY } = this.viewport.getViewport(this);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize

    this.contextMenu.setPosition({ x: e.offsetX, y: e.offsetY })
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    if (e.offsetX > this.viewport.canvas.width - this.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - this.controlPanel.height){
        const intercepted = this.controlPanel.controlPanelRightClick(e);
        if (intercepted) {
          return;
        }
  
      }
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < this.mapController.height) {
        const intercepted = this.mapController.rightClick(e);
        if (intercepted) {
          return;
        }
      }
    }



    this.contextMenu.destinationLocation = {
      x : Math.floor(x / Settings.tileSize),
      y : Math.floor(y / Settings.tileSize)
    }
    
    /* gather options */
    let menuOptions: MenuOption[] = [
    ]

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this, x, y, this.tickPercent)
    mobs.forEach((mob) => {
      menuOptions = menuOptions.concat(mob.contextActions(this, x, y))
    })

    const groundItems: Item[] = this.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    groundItems.forEach((item: Item) => {
      menuOptions.push(
        {
          text: [ { text: 'Take ', fillStyle: 'white' }, { text: item.itemName, fillStyle: '#FF911F' } ],
          action: () => this.player.setSeekingItem(item)
        }
      )
    });

    menuOptions.push(
      {
        text: [{ text: 'Walk Here', fillStyle: 'white' }],
        action: () => {
          this.yellowClick()
          this.playerWalkClick(this.contextMenu.destinationLocation.x * Settings.tileSize, this.contextMenu.destinationLocation.y * Settings.tileSize)
        }
      }
    )
    this.contextMenu.setMenuOptions(menuOptions)
    this.contextMenu.setActive()
  }

  playerAttackClick (mob: Unit) {
    this.inputDelay = setTimeout(() => {
      this.player.setAggro(mob);
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
    this.region.drawGroundItems(this.worldCtx)

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

    this.viewport.context.drawImage(this.worldCanvas, -viewportX * Settings.tileSize, -viewportY * Settings.tileSize);

    this.viewport.context.restore()
    this.viewport.context.save();

    // draw control panel
    this.viewport.context.translate(this.viewport.canvas.width - this.controlPanel.width, this.viewport.canvas.height - this.controlPanel.height)
    this.controlPanel.draw(this)

    this.viewport.context.restore();

    XpDropController.controller.draw(this.viewport.context, this.viewport.canvas.width - 140 - this.mapController.width, 0, this.tickPercent);
    MapController.controller.draw(this.viewport.context, this.tickPercent);


    this.contextMenu.draw(this)
    if (this.clickAnimation) {
      this.clickAnimation.draw(this, this.tickPercent)
    }

    this.viewport.context.restore()
    this.viewport.context.save()

    // Performance info
    this.viewport.context.textAlign = 'left'

    if (!process.env.BUILD_DATE) {
      this.viewport.context.fillStyle = '#FFFF0066'
      this.viewport.context.font = '16px OSRS'
      this.viewport.context.fillText(`FPS: ${Math.round(this.fps * 100) / 100}`, 0, 16)
      this.viewport.context.fillText(`DFR: ${Settings.framesPerTick * (1 / 0.6)}`, 0, 32)
      this.viewport.context.fillText(`TBT: ${Math.round(this.timeBetweenTicks)}ms`, 0, 48)
      this.viewport.context.fillText(`TT: ${Math.round(this.tickTime)}ms`, 0, 64)
      this.viewport.context.fillText(`FT: ${Math.round(this.frameTime)}ms`, 0, 80)
      this.viewport.context.fillText(`DT: ${Math.round(this.drawTime)}ms`, 0, 96)
      this.viewport.context.fillText(`Wave: ${this.wave}`, 0, 112)  
    }

    if (this.getReadyTimer) {
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

  startTicking () {
    this.isPaused = false;
    this.ticker = setInterval(this.worldLoop.bind(this), Settings.tickMs / Settings.framesPerTick)
  }

  stopTicking() {
    this.isPaused = true;
    clearInterval(this.ticker);
  }
}
