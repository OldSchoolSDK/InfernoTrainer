'use strict'
import { AccountControls } from './controlpanels/AccountControls'
import { AncientsSpellbookControls } from './controlpanels/AncientsSpellbookControls'
import { BaseControls } from './controlpanels/BaseControls'
import { ClanChatControls } from './controlpanels/ClanChatControls'
import { CombatControls } from './controlpanels/CombatControls'
import { EmotesControls } from './controlpanels/EmotesControls'
import { EmptyControls } from './controlpanels/EmptyControls'
import { EquipmentControls } from './controlpanels/EquipmentControls'
import { FriendsControls } from './controlpanels/FriendsControls'
import { InventoryControls } from './controlpanels/InventoryControls'
import { MusicControls } from './controlpanels/MusicControls'
import { PrayerControls } from './controlpanels/PrayerControls'
import { QuestsControls } from './controlpanels/QuestsControls'
import { SettingsControls } from './controlpanels/SettingsControls'
import { StatsControls } from './controlpanels/StatsControls'
import { World } from './World'
import { Settings } from './Settings'

interface TabPosition{
  x: number;
  y: number;
}

export class ControlPanelController {
  static controls = Object.freeze({
    COMBAT: new CombatControls(),
    INVENTORY: new InventoryControls(),
    PRAYER: new PrayerControls(),
    EQUIPMENT: new EquipmentControls(),
    STATS: new StatsControls(),
    ANCIENTSSPELLBOOK: new AncientsSpellbookControls()
  });

  world?: World;
  desktopControls: BaseControls[];
  mobileControls: BaseControls[];
  selectedControl: BaseControls;
  
  width: number;
  height: number;

  constructor () {

    this.width = 33 * 7
    this.height = 36 * 2 + 275

    this.world = null


    this.desktopControls = [
      ControlPanelController.controls.COMBAT,
      ControlPanelController.controls.STATS,
      new QuestsControls(),
      ControlPanelController.controls.INVENTORY,
      ControlPanelController.controls.EQUIPMENT,
      ControlPanelController.controls.PRAYER,
      ControlPanelController.controls.ANCIENTSSPELLBOOK,
      new EmptyControls(),
      new FriendsControls(),
      new AccountControls(),
      new ClanChatControls(),
      new SettingsControls(),
      new EmotesControls(),
      new MusicControls()
    ]

    this.mobileControls = [
      ControlPanelController.controls.COMBAT,
      ControlPanelController.controls.PRAYER,
      ControlPanelController.controls.ANCIENTSSPELLBOOK,
      new EmotesControls(),
      new ClanChatControls(),
      new FriendsControls(),
      new AccountControls(),

      // break
      ControlPanelController.controls.INVENTORY,
      ControlPanelController.controls.EQUIPMENT,
      ControlPanelController.controls.STATS,
      new QuestsControls(),
      new MusicControls(),
      new SettingsControls(),
      new EmptyControls(),
    ]

    this.selectedControl = ControlPanelController.controls.PRAYER


    document.addEventListener('keydown', (event) => {
      if (Settings.is_keybinding){
        return;
      }
      
      this.desktopControls.forEach((control) => {
        if (control.keyBinding === event.key) {
          this.selectedControl = control
          event.preventDefault();
        }
      })
    })
  }

  setWorld (world: World) {
    this.world = world
  }

  tabPosition (i: number, compact: boolean): TabPosition {
    if (compact) {
      const x = i % 7
      const y = Math.floor(i / 7)
      return { x: x * 33, y: y * 36 }
    }
    // untested
    return { x: i * 33, y: 0 }
  }

  mobileTabPosition (i: number, world: World): TabPosition {
    let scale = 0.9;

    const mapHeight = 110;

    const spacer = (world.viewport.canvas.height - mapHeight - (36 * 7)) / 2;

    if (i < 7) {
      return { x: 30, y: mapHeight + spacer + i * 36 };
    }else{
      return { x: world.viewport.canvas.width - 78, y: mapHeight + spacer + (i - 7) * 36 };
    }

    // return { x: 0, y: 0 };

    // if (compact) {
    //   const x = i % 7
    //   const y = Math.floor(i / 7)
    //   return { x: x * 33, y: y * 36 + 275 }
    // }
    // // untested
    // return { x: i * 33, y: 0 }
  }

  cursorMovedTo (e: MouseEvent) {
    let scale = 0.9;
    if (this.selectedControl) {

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelX = this.width - panelWidth
    const panelY = 275 - panelHeight
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        this.selectedControl.cursorMovedto(this.world, relativeX, relativeY)
      }
    }


    }
  }
  controlPanelRightClick (e: MouseEvent): boolean {
    let intercepted = false;
    let scale = 0.9;

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelX = this.width - panelWidth
    const panelY = 275 - panelHeight
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelRightClick(this.world, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  controlPanelClickUp (e: MouseEvent): boolean {

    let scale = 0.9;
    if (!this.selectedControl) {
      return false;
    }
    
    let intercepted = false;

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelX = this.width - panelWidth
    const panelY = 275 - panelHeight
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelClickUp(this.world, relativeX, relativeY)
      }
    }

    return intercepted;

  }

  controlPanelClickDown (e: MouseEvent): boolean {
    let intercepted = false;
    let scale = 0.9;

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    if (y > 275) {
      this.desktopControls.forEach((control: BaseControls, index: number) => {
        const tabPosition = this.tabPosition(index, true)
        if (tabPosition.x <= x && x < tabPosition.x + 33) {
          if (tabPosition.y <= y && x < tabPosition.y + 36) {
            intercepted = true;
            if (this.desktopControls[index] === this.selectedControl) {
              this.selectedControl = null
              return
            }
            this.selectedControl = this.desktopControls[index]
          }
        }
      })
    }

    if (!this.selectedControl) {
      return intercepted;
    }

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelX = this.width - panelWidth
    const panelY = 275 - panelHeight
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelClickDown(this.world, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  draw (world: World) {
    world.viewport.context.fillStyle = '#000'

    let scale = 0.9;
    if (this.selectedControl && this.selectedControl.draw) {


      const mapHeight = 110;
      const spacer = (world.viewport.canvas.height - mapHeight - (36 * 7)) / 2;

      if (this.selectedControl.appearsOnLeftInMobile) {
        this.selectedControl.draw(world, this, 63, mapHeight + spacer)
      }else{
        this.selectedControl.draw(world, this, world.viewport.canvas.width - 78 - 200 * 0.9, mapHeight + spacer)
      }
    }

    let selectedPosition: TabPosition = null


    // this.desktopControls.forEach((control, index) => {
    //   const tabPosition = this.tabPosition(index, true)
    //   if (control.tabImage){
    //     world.viewport.context.drawImage(control.tabImage, world.viewport.canvas.width - 232 + tabPosition.x, world.viewport.canvas.height - 72 + tabPosition.y, control.tabImage.width, control.tabImage.height)
    //   }

    //   if ([0,1,3,4,5,6,11].indexOf(index) === -1){
    //     world.viewport.context.fillStyle = '#00000099'
    //     world.viewport.context.fillRect(world.viewport.canvas.width - 232 + tabPosition.x, world.viewport.canvas.height - 72 + tabPosition.y, 33, 36)
  
    //   }

      
    //   if (control === this.selectedControl) {
    //     selectedPosition = tabPosition
    //   }
    // })

    // if (selectedPosition) {
    //   world.viewport.context.strokeStyle = '#00FF0073'
    //   world.viewport.context.lineWidth = 3
    //   world.viewport.context.strokeRect(world.viewport.canvas.width - 232 + selectedPosition.x, world.viewport.canvas.height - 72 + selectedPosition.y, 33, 36)
    // }


    




    this.mobileControls.forEach((control, index) => {
      const tabPosition = this.mobileTabPosition(index, world)
      if (control.tabImage){
        world.viewport.context.drawImage(control.tabImage, tabPosition.x, tabPosition.y, control.tabImage.width, control.tabImage.height)
      }

      if ([0,1,2, 7, 8, 9, 12].indexOf(index) === -1){
        world.viewport.context.fillStyle = '#00000099'
        world.viewport.context.fillRect(tabPosition.x, tabPosition.y, 33, 36)
  
      }

      
      if (control === this.selectedControl) {
        selectedPosition = tabPosition
      }
    })

    if (selectedPosition) {
      world.viewport.context.strokeStyle = '#00FF0073'
      world.viewport.context.lineWidth = 3
      world.viewport.context.strokeRect(selectedPosition.x, selectedPosition.y, 33, 36)
    }



  }
}
