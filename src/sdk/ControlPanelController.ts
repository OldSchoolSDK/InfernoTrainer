"use strict";
import { AccountControls } from "./controlpanels/AccountControls";
import { AncientsSpellbookControls } from "./controlpanels/AncientsSpellbookControls";
import { BaseControls } from "./controlpanels/BaseControls";
import { ClanChatControls } from "./controlpanels/ClanChatControls";
import { CombatControls } from "./controlpanels/CombatControls";
import { EmotesControls } from "./controlpanels/EmotesControls";
import { EmptyControls } from "./controlpanels/EmptyControls";
import { EquipmentControls } from "./controlpanels/EquipmentControls";
import { FriendsControls } from "./controlpanels/FriendsControls";
import { InventoryControls } from "./controlpanels/InventoryControls";
import { MusicControls } from "./controlpanels/MusicControls";
import { PrayerControls } from "./controlpanels/PrayerControls";
import { QuestsControls } from "./controlpanels/QuestsControls";
import { SettingsControls } from "./controlpanels/SettingsControls";
import { StatsControls } from "./controlpanels/StatsControls";
import { Settings } from "./Settings";
import { Location } from "./Location";
import { Chrome } from "./Chrome";
import { MapController } from "./MapController";
import { Viewport } from "./Viewport";

interface TabPosition {
  x: number;
  y: number;
}

const BASE_WIDTH = 33 * 7;
const BASE_HEIGHT = 36 * 2 + 275;

export class ControlPanelController {
  static controls = Object.freeze({
    COMBAT: new CombatControls(),
    INVENTORY: new InventoryControls(),
    PRAYER: new PrayerControls(),
    EQUIPMENT: new EquipmentControls(),
    STATS: new StatsControls(),
    ANCIENTSSPELLBOOK: new AncientsSpellbookControls(),
  });

  static controller = new ControlPanelController();

  desktopControls: BaseControls[];
  mobileControls: BaseControls[];
  controls: BaseControls[];
  selectedControl: BaseControls;

  public width: number;
  public height: number;

  isUsingExternalUI = false;

  constructor() {
    this.width = BASE_WIDTH;
    this.height = BASE_HEIGHT;

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
      new MusicControls(),
    ];

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
    ];
    this.controls = Settings.mobileCheck() ? this.mobileControls : this.desktopControls;

    this.selectedControl = ControlPanelController.controls.PRAYER;

    // TODO: Technically a violation of separation of framework and inferno stuff. hmm.
    const waveInput = document.getElementById("waveinput");
    waveInput.addEventListener("focus", () => (this.isUsingExternalUI = true));
    waveInput.addEventListener("focusout", () => (this.isUsingExternalUI = false));
    document.addEventListener("keydown", (event) => {
      if (Settings.is_keybinding) {
        return;
      }

      if (this.isUsingExternalUI) {
        return;
      }

      this.controls.forEach((control) => {
        if (control.keyBinding === event.key) {
          this.selectedControl = control;
          event.preventDefault();
        }
      });
    });
  }

  getTabScale() {
    const { width, height } = Chrome.size();

    const controlAreaHeight = height - MapController.controller.height;
    let scaleRatio = controlAreaHeight / 7 / 36;

    let maxScaleRatio = Settings.maxUiScale;
    if (Settings.mobileCheck() && width > 600) {
      maxScaleRatio = Settings.maxUiScale * 1.1;
    }

    if (scaleRatio > maxScaleRatio) {
      scaleRatio = maxScaleRatio;
    }

    // not the best place for these setters...
    Settings.controlPanelScale = scaleRatio * 0.915;
    this.width = BASE_WIDTH * scaleRatio;
    this.height = BASE_HEIGHT * scaleRatio;

    return scaleRatio;
  }

  tabPosition(i: number): TabPosition {
    // let scale = Settings.controlPanelScale
    const { width, height } = Chrome.size();
    const scale = this.getTabScale();

    if (Settings.mobileCheck()) {
      const mapHeight = 170 * Settings.minimapScale;
      const spacer = (height - mapHeight - 36 * scale * 7) / 2;
      if (i < 7) {
        return { x: 15, y: mapHeight + spacer + i * 36 * scale };
      } else {
        return {
          x: width - 33 * scale - 15 - (Settings.menuVisible ? 232 : 0),
          y: mapHeight + spacer + (i - 7) * 36 * scale,
        };
      }
    } else {
      const x = i % 7;
      const y = Math.floor(i / 7);
      return {
        x: width - 231 * scale + x * 33 * scale - (Settings.menuVisible ? 232 : 0),
        y: height - 72 * scale + y * 36 * scale,
      };
    }
  }
  cursorMovedTo(e: MouseEvent) {
    const scale = Settings.controlPanelScale;
    if (this.selectedControl) {
      const x = e.offsetX;
      const y = e.offsetY;

      const panelWidth = 204 * scale;
      const panelHeight = 275 * scale;
      const panelPosition = this.controlPosition(this.selectedControl);
      const panelX = panelPosition.x;
      const panelY = panelPosition.y;
      if (panelX < x && x < panelX + panelWidth) {
        if (panelY < y && y < panelY + panelHeight) {
          const relativeX = x - panelX;
          const relativeY = y - panelY;
          this.selectedControl.cursorMovedto(relativeX, relativeY);
        }
      }
    }
  }
  controlPanelRightClick(e: MouseEvent): boolean {
    let intercepted = false;

    const scale = Settings.controlPanelScale;
    const x = e.offsetX;
    const y = e.offsetY;

    const panelWidth = 204 * scale;
    const panelHeight = 275 * scale;
    const panelPosition = this.controlPosition(this.selectedControl);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX;
        const relativeY = y - panelY;
        intercepted = true;
        this.selectedControl.panelRightClick(relativeX, relativeY);
      }
    }

    return intercepted;
  }

  controlPanelClickUp(e: MouseEvent): boolean {
    const scale = Settings.controlPanelScale;
    if (!this.selectedControl) {
      return false;
    }

    let intercepted = false;

    const x = e.offsetX;
    const y = e.offsetY;

    const panelWidth = 204 * scale;
    const panelHeight = 275 * scale;
    const panelPosition = this.controlPosition(this.selectedControl);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX;
        const relativeY = y - panelY;
        intercepted = true;
        this.selectedControl.panelClickUp(relativeX, relativeY);
      }
    }

    return intercepted;
  }

  controlPanelClickDown(e: MouseEvent): boolean {
    let intercepted = false;

    const scale = Settings.controlPanelScale;

    const x = e.offsetX;
    const y = e.offsetY;

    this.controls.forEach((control: BaseControls, index: number) => {
      const tabPosition = this.tabPosition(index);
      if (tabPosition.x <= x && x < tabPosition.x + 33 * scale) {
        if (tabPosition.y <= y && y < tabPosition.y + 36 * scale) {
          intercepted = true;
          if (this.controls[index] === this.selectedControl) {
            this.selectedControl = null;
            return;
          }
          this.selectedControl = this.controls[index];
        }
      }
    });

    if (!this.selectedControl) {
      return intercepted;
    }

    const panelWidth = 204 * scale;
    const panelHeight = 275 * scale;
    const panelPosition = this.controlPosition(this.selectedControl);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX;
        const relativeY = y - panelY;
        intercepted = true;
        this.selectedControl.panelClickDown(relativeX, relativeY);
      }
    }

    return intercepted;
  }

  controlPosition(control: BaseControls): Location {
    const scale = this.getTabScale();
    const { width, height } = Chrome.size();

    if (Settings.mobileCheck()) {
      const mapHeight = 170 * Settings.minimapScale;
      const spacer = (height - mapHeight - 36 * scale * 7) / 2;
      if (this.selectedControl.appearsOnLeftInMobile) {
        // left side mobile
        return { x: 33 * scale + 15, y: mapHeight + spacer };
      } else {
        // right side mobile
        return {
          x: width - 33 * scale - 15 - 200 * Settings.controlPanelScale - (Settings.menuVisible ? 232 : 0),
          y: mapHeight + spacer,
        };
      }
    } else {
      // desktop compact
      return {
        x: width - 188 * scale - (Settings.menuVisible ? 232 : 0),
        y: height - 72 * scale - 251 * scale,
      };
    }
  }

  draw(context: CanvasRenderingContext2D) {
    Viewport.viewport.context.fillStyle = "#000";
    const scale = this.getTabScale();

    if (this.selectedControl && this.selectedControl.draw) {
      const position = this.controlPosition(this.selectedControl);
      this.selectedControl.draw(context, this, position.x, position.y);
    }

    let selectedPosition: TabPosition = null;

    this.controls.forEach((control, index) => {
      const tabPosition = this.tabPosition(index);
      if (control.tabImage) {
        context.drawImage(
          control.tabImage,
          tabPosition.x,
          tabPosition.y,
          control.tabImage.width * scale,
          control.tabImage.height * scale,
        );
      }

      if (control.isAvailable === false) {
        context.fillStyle = "#00000099";
        context.fillRect(tabPosition.x, tabPosition.y, 33 * scale, 36 * scale);
      }

      if (control === this.selectedControl) {
        selectedPosition = tabPosition;
      }
    });

    if (selectedPosition) {
      context.strokeStyle = "#00FF0073";
      context.lineWidth = 3;
      context.strokeRect(selectedPosition.x, selectedPosition.y, 33 * scale, 36 * scale);
    }
  }
}
