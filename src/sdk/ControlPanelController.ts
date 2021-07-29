'use strict'
import { AccountControls } from './cps/AccountControls'
import { AncientsSpellbookControls } from './cps/AncientsSpellbookControls'
import { BaseControls } from './cps/BaseControls'
import { ClanChatControls } from './cps/ClanChatControls'
import { CombatControls } from './cps/CombatControls'
import { EmotesControls } from './cps/EmotesControls'
import { EmptyControls } from './cps/EmptyControls'
import { EquipmentControls } from './cps/EquipmentControls'
import { FriendsControls } from './cps/FriendsControls'
import { InventoryControls } from './cps/InventoryControls'
import { MusicControls } from './cps/MusicControls'
import { PrayerControls } from './cps/PrayerControls'
import { QuestsControls } from './cps/QuestsControls'
import { SettingsControls } from './cps/SettingsControls'
import { StatsControls } from './cps/StatsControls'
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

    document.addEventListener('keypress', (event) => {
      if (Settings.is_keybinding){
        return;
      }
      this.controls.forEach((control) => {
        if (control.keyBinding === event.key) {
          this.selectedControl = control
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

  controlPanelClick (e: MouseEvent): boolean {
    let intercepted = false;

    const x = e.offsetX - (this.world.viewport.width - this.width);
    const y = e.offsetY - (this.world.viewport.height - this.height);

    if (y > 275) {
      this.controls.forEach((control: BaseControls, index: number) => {
        const tabPosition = this.tabPosition(index, true)
        if (tabPosition.x <= x && x < tabPosition.x + 33) {
          if (tabPosition.y <= y && x < tabPosition.y + 36) {
            if (this.controls[index] === this.selectedControl) {
              this.selectedControl = null
              return
            }
            intercepted = true;
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
        this.selectedControl.clickedPanel(this.world, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  draw (world: World) {
    world.viewportCtx.fillStyle = '#000'

    if (this.selectedControl && this.selectedControl.draw) {
      this.selectedControl.draw(world, this, this.width - 204, 0)
    }

    let selectedPosition: TabPosition = null
    this.controls.forEach((control, index) => {
      const tabPosition = this.tabPosition(index, true)
      if (control.tabImage){
        world.viewportCtx.drawImage(control.tabImage, tabPosition.x, tabPosition.y)
      }
      if (control === this.selectedControl) {
        selectedPosition = tabPosition
      }
    })
    if (selectedPosition) {
      world.viewportCtx.strokeStyle = '#00FF0073'
      world.viewportCtx.lineWidth = 3
      world.viewportCtx.strokeRect(selectedPosition.x, selectedPosition.y, 33, 36)
    }
  }
}
