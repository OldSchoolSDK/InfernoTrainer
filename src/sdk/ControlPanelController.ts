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
    INVENTORY: new InventoryControls(),
    PRAYER: new PrayerControls(),
    EQUIPMENT: new EquipmentControls(),
    STATS: new StatsControls(),
    ANCIENTSSPELLBOOK: new AncientsSpellbookControls()
  });

  world?: World;
  controls: BaseControls[];
  selectedControl: BaseControls;
  
  width: number;
  height: number;

  constructor () {

    this.width = 33 * 7
    this.height = 36 * 2 + 275

    this.world = null


    this.controls = [
      new CombatControls(),
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

    this.selectedControl = ControlPanelController.controls.PRAYER


    document.addEventListener('keydown', (event) => {
      if (Settings.is_keybinding){
        return;
      }
      
      this.controls.forEach((control) => {
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
      return { x: x * 33, y: y * 36 + 275 }
    }
    // untested
    return { x: i * 33, y: 0 }
  }

  cursorMovedTo (e: MouseEvent) {
    if (this.selectedControl) {

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelX = this.width - 204
    const panelY = 0
    const panelWidth = 204
    const panelHeight = 275
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

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelX = this.width - 204
    const panelY = 0
    const panelWidth = 204
    const panelHeight = 275
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

    let intercepted = false;

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    const panelX = this.width - 204
    const panelY = 0
    const panelWidth = 204
    const panelHeight = 275
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

    const x = e.offsetX - (this.world.viewport.canvas.width - this.width);
    const y = e.offsetY - (this.world.viewport.canvas.height - this.height);

    if (y > 275) {
      this.controls.forEach((control: BaseControls, index: number) => {
        const tabPosition = this.tabPosition(index, true)
        if (tabPosition.x <= x && x < tabPosition.x + 33) {
          if (tabPosition.y <= y && x < tabPosition.y + 36) {
            intercepted = true;
            if (this.controls[index] === this.selectedControl) {
              this.selectedControl = null
              return
            }
            this.selectedControl = this.controls[index]
          }
        }
      })
    }

    if (!this.selectedControl) {
      return intercepted;
    }

    const panelX = this.width - 204
    const panelY = 0
    const panelWidth = 204
    const panelHeight = 275
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

    if (this.selectedControl && this.selectedControl.draw) {
      this.selectedControl.draw(world, this, this.width - 204, 0)
    }

    let selectedPosition: TabPosition = null
    this.controls.forEach((control, index) => {
      const tabPosition = this.tabPosition(index, true)
      if (control.tabImage){
        world.viewport.context.drawImage(control.tabImage, tabPosition.x, tabPosition.y)
      }

      if ([1,3,4,5,6, 11].indexOf(index) === -1){
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
