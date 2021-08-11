import { ClickAnimation } from './ClickAnimation';
import { Collision } from './Collision';
import { MenuOption } from './ContextMenu';
import { Item } from './Item';
import { Settings } from './Settings';
import { Unit } from './Unit';
import { Viewport } from './Viewport';

export class ClickController {
  inputDelay?: NodeJS.Timeout = null;
  clickAnimation?: ClickAnimation = null;  
  viewport: Viewport;

  registerClickActions() {
    this.viewport.canvas.addEventListener('mousedown', this.leftClickDown.bind(this))
    this.viewport.canvas.addEventListener('mouseup', this.leftClickUp.bind(this))
    this.viewport.canvas.addEventListener('mousemove', (e: MouseEvent) => this.viewport.world.controlPanel.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', (e: MouseEvent) => this.viewport.world.mapController.cursorMovedTo(e))
    this.viewport.canvas.addEventListener('mousemove', (e) => this.viewport.world.contextMenu.cursorMovedTo(this.viewport.world, e.clientX, e.clientY))
    this.viewport.canvas.addEventListener('contextmenu', this.rightClick.bind(this));
  }
  leftClickUp (e: MouseEvent) {

    if (e.button !== 0) {
      return;
    }
    const { viewportX, viewportY } = this.viewport.getViewport(this.viewport.world);
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


    const xAlign = this.viewport.world.contextMenu.location.x - (this.viewport.world.contextMenu.width / 2) < e.offsetX && e.offsetX < this.viewport.world.contextMenu.location.x + this.viewport.world.contextMenu.width / 2
    const yAlign = this.viewport.world.contextMenu.location.y < e.offsetY && e.offsetY < this.viewport.world.contextMenu.location.y + this.viewport.world.contextMenu.height


    if (e.offsetX > this.viewport.canvas.width - this.viewport.world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - this.viewport.world.controlPanel.height){
        const intercepted = this.viewport.world.controlPanel.controlPanelClickUp(e);
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

    
    this.viewport.world.contextMenu.cursorMovedTo(this.viewport.world, e.clientX, e.clientY)
    const { viewportX, viewportY } = this.viewport.getViewport(this.viewport.world);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    } 

    const xAlign = this.viewport.world.contextMenu.location.x - (this.viewport.world.contextMenu.width / 2) < e.offsetX && e.offsetX < this.viewport.world.contextMenu.location.x + this.viewport.world.contextMenu.width / 2
    const yAlign = this.viewport.world.contextMenu.location.y < e.offsetY && e.offsetY < this.viewport.world.contextMenu.location.y + this.viewport.world.contextMenu.height

    if (this.viewport.world.contextMenu.isActive && xAlign && yAlign) {
      this.viewport.world.contextMenu.clicked(this.viewport.world, e.offsetX, e.offsetY)
      this.viewport.world.contextMenu.setInactive();
      return;
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < this.viewport.world.mapController.height) {
        const intercepted = this.viewport.world.mapController.leftClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (e.offsetX > this.viewport.canvas.width - this.viewport.world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - this.viewport.world.controlPanel.height){
        const intercepted = this.viewport.world.controlPanel.controlPanelClickDown(e);
        if (intercepted) {
          return;
        }
      }
    }

    if (this.inputDelay) {
      clearTimeout(this.inputDelay)
    }

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this.viewport.world, x, y, this.viewport.world.tickPercent)
    const groundItems = this.viewport.world.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize));

    this.viewport.world.player.setAggro(null)
    if (mobs.length && mobs[0].canBeAttacked()) {
      this.redClick()
      this.playerAttackClick(mobs[0])
    } else if (groundItems.length){
      this.redClick()
      this.viewport.world.player.setSeekingItem(groundItems[0])
    } else {
      this.yellowClick()
      this.playerWalkClick(x, y)
    }
    this.viewport.world.contextMenu.setInactive()
  }

  rightClick (e: MouseEvent) {
    

    const { viewportX, viewportY } = this.viewport.getViewport(this.viewport.world);
    let x = e.offsetX + viewportX * Settings.tileSize
    let y = e.offsetY + viewportY * Settings.tileSize

    this.viewport.world.contextMenu.setPosition({ x: e.offsetX, y: e.offsetY })
    if (Settings.rotated === 'south') {
      x = this.viewport.width * Settings.tileSize - e.offsetX + viewportX * Settings.tileSize
      y = this.viewport.height * Settings.tileSize - e.offsetY + viewportY * Settings.tileSize
    }

    if (e.offsetX > this.viewport.canvas.width - this.viewport.world.controlPanel.width) {
      if (e.offsetY > this.viewport.height * Settings.tileSize - this.viewport.world.controlPanel.height){
        const intercepted = this.viewport.world.controlPanel.controlPanelRightClick(e);
        if (intercepted) {
          return;
        }
  
      }
    }

    if (e.offsetX > this.viewport.width * Settings.tileSize) {
      if (e.offsetY < this.viewport.world.mapController.height) {
        const intercepted = this.viewport.world.mapController.rightClick(e);
        if (intercepted) {
          return;
        }
      }
    }
    
    this.viewport.world.contextMenu.destinationLocation = {
      x : Math.floor(x / Settings.tileSize),
      y : Math.floor(y / Settings.tileSize)
    }
    
    /* gather options */
    let menuOptions: MenuOption[] = [
    ]

    const mobs = Collision.collidesWithAnyMobsAtPerceivedDisplayLocation(this.viewport.world, x, y, this.viewport.world.tickPercent)
    mobs.forEach((mob) => {
      menuOptions = menuOptions.concat(mob.contextActions(this.viewport.world, x, y))
    })

    const groundItems: Item[] = this.viewport.world.region.groundItemsAtLocation(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
    groundItems.forEach((item: Item) => {
      menuOptions.push(
        {
          text: [ { text: 'Take ', fillStyle: 'white' }, { text: item.itemName, fillStyle: '#FF911F' } ],
          action: () => this.viewport.world.player.setSeekingItem(item)
        }
      )
    });

    menuOptions.push(
      {
        text: [{ text: 'Walk Here', fillStyle: 'white' }],
        action: () => {
          this.yellowClick()
          this.playerWalkClick(this.viewport.world.contextMenu.destinationLocation.x * Settings.tileSize, this.viewport.world.contextMenu.destinationLocation.y * Settings.tileSize)
        }
      }
    )
    this.viewport.world.contextMenu.setMenuOptions(menuOptions)
    this.viewport.world.contextMenu.setActive()
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
    this.clickAnimation = new ClickAnimation('red', this.viewport.world.contextMenu.cursorPosition.x, this.viewport.world.contextMenu.cursorPosition.y)
  }
  yellowClick () {
    this.clickAnimation = new ClickAnimation('yellow', this.viewport.world.contextMenu.cursorPosition.x, this.viewport.world.contextMenu.cursorPosition.y)
  }
}