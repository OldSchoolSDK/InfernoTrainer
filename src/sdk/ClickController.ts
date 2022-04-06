import { filter } from 'lodash';
import { TileMarker } from '../content/TileMarker';
import { ClickAnimation } from './ClickAnimation';
import { Collision } from './Collision';
import { MenuOption } from './ContextMenu';
import { Entity } from './Entity';
import { EntityName } from './EntityName';
import { Item } from './Item';
import { Pathing } from './Pathing';
import { Settings } from './Settings';
import { Unit } from './Unit';
import { Viewport } from './Viewport';
import { Chrome } from './Chrome';
import { MapController } from './MapController';
import { ControlPanelController } from './ControlPanelController';
import { Player } from './Player';
import { CommandStrength, QueueableCommand } from './CommandQueue';
import { CommandOpCodes } from './OpcodeBindings';

export class ClickController {
  inputDelay?: NodeJS.Timeout = null;
  viewport: Viewport;
  clickAnimation: ClickAnimation;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  eventListeners: ((e: MouseEvent) => void)[] = []

  unload() {
    this.viewport.canvas.removeEventListener('mousedown', this.eventListeners[0])
    this.viewport.canvas.removeEventListener('mouseup', this.eventListeners[1])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[2])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[3])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[4])
    this.viewport.canvas.removeEventListener('wheel', this.eventListeners[6])
  }

  registerClickActions() {
    this.viewport.canvas.addEventListener('mousedown', this.eventListeners[0] = this.clickDown.bind(this))
    this.viewport.canvas.addEventListener('mouseup', this.eventListeners[1] = this.leftClickUp.bind(this))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[2] = (e: MouseEvent) => ControlPanelController.controller.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[3] = (e: MouseEvent) => MapController.controller.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[4] = (e) => Viewport.viewport.contextMenu.cursorMovedTo(e.clientX, e.clientY))
    this.viewport.canvas.addEventListener('wheel', this.eventListeners[6] = this.wheel.bind(this))
  }

  wheel (e: WheelEvent) {

    Settings.zoomScale -= (e.deltaY / 500);

    if (Settings.zoomScale < 0.5) {
      Settings.zoomScale = 0.5;
    }


    if (Settings.zoomScale > 2) {
      Settings.zoomScale = 2;
    }
    
    Settings.persistToStorage();

  }

  leftClickUp (e: MouseEvent) {
    
    if (e.button !== 0) {
      return;
    }
    
    if (Settings.mobileCheck()) {
      if (e.offsetX > 20 && e.offsetX < 60) {
        if (e.offsetY > 20 && e.offsetY < 60) {
          // reset button
          location.reload();
        }
      }
    }
    
    const intercepted = ControlPanelController.controller.controlPanelClickUp(e);
    if (intercepted) {
      return;
    }
  }


  rightClickDown (e: MouseEvent) {

    const region = Viewport.viewport.player.region; // TODO: Redo as InfernoRegion;
    const world = Viewport.viewport.player.region.world;
    
    const { viewportX, viewportY } = Viewport.viewport.getViewport(world.tickPercent);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize

    Viewport.viewport.contextMenu.setPosition({ x: e.offsetX, y: e.offsetY })
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }
    const { width } = Chrome.size();

    if (e.offsetX > width - ControlPanelController.controller.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - ControlPanelController.controller.height){
        const intercepted = ControlPanelController.controller.controlPanelRightClick(e);
        if (intercepted) {
          return;
        }
  
      }
    }

    if (e.offsetX > width - MapController.controller.width) {
      if (e.offsetY < MapController.controller.height) {
        const intercepted = MapController.controller.rightClick(e);
        if (intercepted) {
          return;
        }
      }
    }
    
    Viewport.viewport.contextMenu.destinationLocation = {
      x : Math.floor(x / Settings.tileSize),
      y : Math.floor(y / Settings.tileSize)
    }
    
    /* gather options */
    let menuOptions: MenuOption[] = [
    ]

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(region, x, y, world.tickPercent)
    mobs.forEach((mob) => {
      menuOptions = menuOptions.concat(mob.contextActions(region, x, y))
    })


    
    const players = Collision.collidesWithAnyPlayersAtPerceivedDisplayLocation(region, x, y, world.tickPercent)
    players.forEach((player) => {
      if (player !== Viewport.viewport.player){
        menuOptions = menuOptions.concat(player.contextActions(region, x, y))
      }
    })


    const groundItems: Item[] = region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    groundItems.forEach((item: Item) => {
      menuOptions.push(
        {
          text: [ { text: 'Take ', fillStyle: 'white' }, { text: item.itemName, fillStyle: '#FF911F' } ],
          action: () => Viewport.viewport.player.setSeekingItem(item)
        }
      )
    });

    menuOptions.push(
      {
        text: [{ text: 'Walk Here', fillStyle: 'white' }],
        action: () => {
          this.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x * Settings.tileSize;
          const y = Viewport.viewport.contextMenu.destinationLocation.y * Settings.tileSize;
          
          Viewport.viewport.player.commandQueue.enqueue(
            QueueableCommand.create(CommandOpCodes.MOVEMENT, CommandStrength.STRONG, 0, { x, y }),
          );         
        }
      },
      {
        text: [{ text: 'Mark / Unmark Tile', fillStyle: 'white' }],
        action: () => {
          this.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          
          let removed = false;
          const entitiesAtPoint = Pathing.entitiesAtPoint(region, x, y, 1);
          entitiesAtPoint.forEach((entity: TileMarker) => {
            if (entity.entityName() === EntityName.TILE_MARKER && entity.saveable) {
              region.removeEntity(entity);
              removed = true;
            }
          });
          

          if (!removed) {
            region.addEntity(new TileMarker(Viewport.viewport.player.region, { x, y }, "#FF0000"))
          }

          Settings.tile_markers = filter(filter(region.entities, (entity: Entity) => entity.entityName() === EntityName.TILE_MARKER), (tileMarker: TileMarker) => tileMarker.saveable).map((entity: Entity) => entity.location)

          Settings.persistToStorage();
          
        }
      },
    )

    menuOptions = menuOptions.concat(region.rightClickActions());




    Viewport.viewport.contextMenu.setMenuOptions(menuOptions)
    Viewport.viewport.contextMenu.setActive()
  }

  clickDown (e: MouseEvent) {

    if (e.button === 2) {
      this.rightClickDown(e);
    }


    if (e.button !== 0) {
      return;
    }
    const region = Viewport.viewport.player.region; // TODO: does this ned to go back? : as InfernoRegion;
    const world = Viewport.viewport.player.region.world;
    const player = Viewport.viewport.player;

    Viewport.viewport.contextMenu.cursorMovedTo(e.clientX, e.clientY)
    const { viewportX, viewportY } = Viewport.viewport.getViewport(world.tickPercent);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize

    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    } 

    const xAlign = Viewport.viewport.contextMenu.location.x - (Viewport.viewport.contextMenu.width / 2) < e.offsetX && e.offsetX < Viewport.viewport.contextMenu.location.x + Viewport.viewport.contextMenu.width / 2
    const yAlign = Viewport.viewport.contextMenu.location.y < e.offsetY && e.offsetY < Viewport.viewport.contextMenu.location.y + Viewport.viewport.contextMenu.height

    if (Viewport.viewport.contextMenu.isActive && xAlign && yAlign) {
      Viewport.viewport.contextMenu.clicked(e.offsetX, e.offsetY)
      Viewport.viewport.contextMenu.setInactive();
      return;
    }

    const intercepted = MapController.controller.leftClickDown(e);
    if (intercepted) {
      return;
    }
    

    const controlPanelIntercepted = ControlPanelController.controller.controlPanelClickDown(e);
    if (controlPanelIntercepted) {
      return;
    }





    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(region, x, y, world.tickPercent)
    const players = Collision.collidesWithAnyPlayersAtPerceivedDisplayLocation(region, x, y, world.tickPercent).filter((player: Player) => player !== Viewport.viewport.player);
    const groundItems = region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize));

    Viewport.viewport.player.interruptCombat(); // TODO: This is likely not needed with the tick architecture
    if (mobs.length && mobs[0].canBeAttacked()) {
      this.redClick()
      player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.ATTACK, CommandStrength.STRONG, 0, { target: mobs[0] }),
      );  

    } else if (players.length) {
      this.redClick()  
      player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.ATTACK, CommandStrength.STRONG, 0, { target: players[0] }),
      );  
    } else if (groundItems.length){
      this.redClick()
      player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.PICKUP_ITEM, CommandStrength.STRONG, 0, { item: groundItems[0] }),
      );  
    } else {
      this.yellowClick()
      player.commandQueue.enqueue(
        QueueableCommand.create(CommandOpCodes.MOVEMENT, CommandStrength.STRONG, 0, { x, y }),
      );  

    }

    Viewport.viewport.contextMenu.setInactive()
  }
  

  redClick () {
    if (!this.clickAnimation) {
      this.clickAnimation = new ClickAnimation('red', Viewport.viewport.contextMenu.cursorPosition.x, Viewport.viewport.contextMenu.cursorPosition.y);
    }
    this.clickAnimation.ttl = 1;
    this.clickAnimation.color = 'red';
    this.clickAnimation.x = Viewport.viewport.contextMenu.cursorPosition.x;
    this.clickAnimation.y = Viewport.viewport.contextMenu.cursorPosition.y;
  }

  yellowClick () {
    if (!this.clickAnimation) {
      this.clickAnimation = new ClickAnimation('yellow', Viewport.viewport.contextMenu.cursorPosition.x, Viewport.viewport.contextMenu.cursorPosition.y);
    }
    this.clickAnimation.ttl = 1;
    this.clickAnimation.color = 'yellow';
    this.clickAnimation.x = Viewport.viewport.contextMenu.cursorPosition.x;
    this.clickAnimation.y = Viewport.viewport.contextMenu.cursorPosition.y;
  }
}