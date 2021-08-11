import { ClickAnimation } from './ClickAnimation';
import { Collision } from './Collision';
import { MenuOption } from './ContextMenu';
import { Item } from './Item';
import { Settings } from './Settings';
import { Unit } from './Unit';
import { Viewport } from './Viewport';
import { World } from './World';

export class ClickController {
  inputDelay?: NodeJS.Timeout = null;
  clickAnimation?: ClickAnimation = null;  
  viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  eventListeners: ((e: MouseEvent) => void)[] = []

  unload(world: World) {
    this.viewport.canvas.removeEventListener('mousedown', this.eventListeners[0])
    this.viewport.canvas.removeEventListener('mouseup', this.eventListeners[1])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[2])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[3])
    this.viewport.canvas.removeEventListener('mousemove', this.eventListeners[4])
    this.viewport.canvas.removeEventListener('contextmenu', this.eventListeners[5])
  }

  registerClickActions(world: World) {
    this.viewport.canvas.addEventListener('mousedown', this.eventListeners[0] = this.leftClickDown.bind(this))
    this.viewport.canvas.addEventListener('mouseup', this.eventListeners[1] = this.leftClickUp.bind(this))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[2] = (e: MouseEvent) => world.controlPanel.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[3] = (e: MouseEvent) => world.mapController.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', this.eventListeners[4] = (e) => world.contextMenu.cursorMovedTo(world, e.clientX, e.clientY))
    this.viewport.canvas.addEventListener('contextmenu', this.eventListeners[5] = this.rightClick.bind(this));
  }

  leftClickUp (e: MouseEvent) {
    const world = this.viewport.world;
    
    if (e.button !== 0) {
      return;
    }
    const { viewportX, viewportY } = this.viewport.getViewport(world);
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


    const xAlign = world.contextMenu.location.x - (world.contextMenu.width / 2) < e.offsetX && e.offsetX < world.contextMenu.location.x + world.contextMenu.width / 2
    const yAlign = world.contextMenu.location.y < e.offsetY && e.offsetY < world.contextMenu.location.y + world.contextMenu.height


    if (e.offsetX > this.viewport.canvas.width - world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - world.controlPanel.height){
        const intercepted = world.controlPanel.controlPanelClickUp(e);
        if (intercepted) {
          return;
        }
  
      }
    }
  }

  leftClickDown (e: MouseEvent) {

    console.log('casdf')
    if (e.button !== 0) {
      return;
    }

    const world = this.viewport.world;

    world.contextMenu.cursorMovedTo(world, e.clientX, e.clientY)
    const { viewportX, viewportY } = this.viewport.getViewport(world);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    } 

    const xAlign = world.contextMenu.location.x - (world.contextMenu.width / 2) < e.offsetX && e.offsetX < world.contextMenu.location.x + world.contextMenu.width / 2
    const yAlign = world.contextMenu.location.y < e.offsetY && e.offsetY < world.contextMenu.location.y + world.contextMenu.height

    if (world.contextMenu.isActive && xAlign && yAlign) {
      world.contextMenu.clicked(world, e.offsetX, e.offsetY)
      world.contextMenu.setInactive();
      return;
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < world.mapController.height) {
        const intercepted = world.mapController.leftClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (e.offsetX > this.viewport.canvas.width - world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - world.controlPanel.height){
        const intercepted = world.controlPanel.controlPanelClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (this.inputDelay) {
      clearTimeout(this.inputDelay)
    }

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(world, x, y, world.tickPercent)
    const groundItems = world.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize));

    world.player.setAggro(null)
    if (mobs.length && mobs[0].canBeAttacked()) {
      this.redClick()
      this.playerAttackClick(mobs[0])
    } else if (groundItems.length){
      this.redClick()
      world.player.setSeekingItem(groundItems[0])
    } else {
      this.yellowClick()
      this.playerWalkClick(x, y)
    }
    world.contextMenu.setInactive()
  }

  rightClick (e: MouseEvent) {
    const world = this.viewport.world;
    

    const { viewportX, viewportY } = this.viewport.getViewport(world);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize

    world.contextMenu.setPosition({ x: e.offsetX, y: e.offsetY })
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    if (e.offsetX > this.viewport.canvas.width - world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - world.controlPanel.height){
        const intercepted = world.controlPanel.controlPanelRightClick(e);
        if (intercepted) {
          return;
        }
  
      }
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < world.mapController.height) {
        const intercepted = world.mapController.rightClick(e);
        if (intercepted) {
          return;
        }
      }
    }
    
    world.contextMenu.destinationLocation = {
      x : Math.floor(x / Settings.tileSize),
      y : Math.floor(y / Settings.tileSize)
    }
    
    /* gather options */
    let menuOptions: MenuOption[] = [
    ]

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(world, x, y, world.tickPercent)
    mobs.forEach((mob) => {
      menuOptions = menuOptions.concat(mob.contextActions(world, x, y))
    })

    const groundItems: Item[] = world.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    groundItems.forEach((item: Item) => {
      menuOptions.push(
        {
          text: [ { text: 'Take ', fillStyle: 'white' }, { text: item.itemName, fillStyle: '#FF911F' } ],
          action: () => world.player.setSeekingItem(item)
        }
      )
    });

    menuOptions.push(
      {
        text: [{ text: 'Walk Here', fillStyle: 'white' }],
        action: () => {
          this.yellowClick()
          this.playerWalkClick(world.contextMenu.destinationLocation.x * Settings.tileSize, world.contextMenu.destinationLocation.y * Settings.tileSize)
        }
      }
    )
    world.contextMenu.setMenuOptions(menuOptions)
    world.contextMenu.setActive()
  }
  playerAttackClick (mob: Unit) {
    this.inputDelay = setTimeout(() => {    
      this.viewport.world.player.setAggro(mob);
    }, Settings.inputDelay)
  }
  playerWalkClick (x: number, y: number) {
    this.inputDelay = setTimeout(() => {
      this.viewport.world.player.moveTo(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    }, Settings.inputDelay)
  }
  redClick () {
    const world = this.viewport.world;
    this.clickAnimation = new ClickAnimation('red', world.contextMenu.cursorPosition.x, world.contextMenu.cursorPosition.y)
  }
  yellowClick () {
    const world = this.viewport.world;
    this.clickAnimation = new ClickAnimation('yellow', world.contextMenu.cursorPosition.x, world.contextMenu.cursorPosition.y)
  }
}