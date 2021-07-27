'use strict'
import { AccountControls } from './ControlPanels/AccountControls'
import { AncientsSpellbookControls } from './ControlPanels/AncientsSpellbookControls'
import { BaseControls } from './ControlPanels/BaseControls'
import { ClanChatControls } from './ControlPanels/ClanChatControls'
import { CombatControls } from './ControlPanels/CombatControls'
import { EmotesControls } from './ControlPanels/EmotesControls'
import { EmptyControls } from './ControlPanels/EmptyControls'
import { EquipmentControls } from './ControlPanels/EquipmentControls'
import { FriendsControls } from './ControlPanels/FriendsControls'
import { InventoryControls } from './ControlPanels/InventoryControls'
import { MusicControls } from './ControlPanels/MusicControls'
import { PrayerControls } from './ControlPanels/PrayerControls'
import { QuestsControls } from './ControlPanels/QuestsControls'
import { SettingsControls } from './ControlPanels/SettingsControls'
import { StatsControls } from './ControlPanels/StatsControls'
import { Game } from './Game'
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

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  game?: Game;
  controls: BaseControls[];
  selectedControl: BaseControls;
  
  width: number;
  height: number;

  constructor () {

    this.width = 33 * 7
    this.height = 36 * 2 + 275

    this.game = null


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

  setGame (game: Game) {
    this.game = game
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

    const x = e.offsetX - (this.game.canvas.width - this.width);
    const y = e.offsetY - (this.game.canvas.height - this.height);

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
        this.selectedControl.clickedPanel(this.game, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  draw (game: Game) {
    game.ctx.fillStyle = '#000'

    if (this.selectedControl && this.selectedControl.draw) {
      this.selectedControl.draw(game, this, this.width - 204, 0)
    }

    let selectedPosition: TabPosition = null
    this.controls.forEach((control, index) => {
      const tabPosition = this.tabPosition(index, true)
      if (control.tabImage){
        game.ctx.drawImage(control.tabImage, tabPosition.x, tabPosition.y)
      }
      if (control === this.selectedControl) {
        selectedPosition = tabPosition
      }
    })
    if (selectedPosition) {
      game.ctx.strokeStyle = '#00FF0073'
      game.ctx.lineWidth = 3
      game.ctx.strokeRect(selectedPosition.x, selectedPosition.y, 33, 36)
    }
  }
}
