import { BaseControls } from "./BaseControls";

import InventoryPanel from "../../assets/images/panels/inventory.png";
import SettingsTab from "../../assets/images/tabs/settings.png";

import AudioButton from "../../assets/images/interface/sound_effect_volume.png";
import AreaAudioButton from "../../assets/images/interface/area_sound_volume.png";

import DisabledOverlay from "../../assets/images/interface/disabled_option_overlay.png";

import ButtonRedUpIcon from "../../assets/images/interface/button_red_up.png";
import ButtonGreenDownIcon from "../../assets/images/interface/button_green_down.png";
import ButtonActiveIcon from "../../assets/images/interface/button_active.png";
import ButtonInactiveIcon from "../../assets/images/interface/button_inactive.png";

import InventoryTab from "../../assets/images/controlTabs/inventory.png";
import SpellbookTab from "../../assets/images/controlTabs/spellbook.png";
import PrayerTab from "../../assets/images/controlTabs/prayer.png";
import EquipmentTab from "../../assets/images/controlTabs/equipment.png";
import CombatTab from "../../assets/images/controlTabs/style.png";

import { Settings } from "../Settings";
import { BrowserUtils } from "../utils/BrowserUtils";
import { ControlPanelController } from "../ControlPanelController";
import { ImageLoader } from "../utils/ImageLoader";
import { Viewport } from "../Viewport";
import { ToggleButton } from "./ui/ToggleButton";
import { KeyBindingButton } from "./ui/KeyBindingButton";
import { Component } from "./ui/Component";

export class SettingsControls extends BaseControls {
  static instance: SettingsControls | null = null;

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return SettingsTab;
  }

  soundImage: HTMLImageElement = ImageLoader.createImage(AudioButton);
  areaSoundImage: HTMLImageElement = ImageLoader.createImage(AreaAudioButton);
  disabledOverlay: HTMLImageElement = ImageLoader.createImage(DisabledOverlay);
  redUpImage: HTMLImageElement = ImageLoader.createImage(ButtonRedUpIcon);
  greenDownImage: HTMLImageElement = ImageLoader.createImage(ButtonGreenDownIcon);
  activeButtonImage: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon);
  inactiveButtonImage: HTMLImageElement = ImageLoader.createImage(ButtonInactiveIcon);
  inventoryImage: HTMLImageElement = ImageLoader.createImage(InventoryTab);
  spellbookImage: HTMLImageElement = ImageLoader.createImage(SpellbookTab);
  prayerImage: HTMLImageElement = ImageLoader.createImage(PrayerTab);
  equipmentImage: HTMLImageElement = ImageLoader.createImage(EquipmentTab);
  combatImage: HTMLImageElement = ImageLoader.createImage(CombatTab);
  bindingKey?: string;

  private components: Component[] = [
    // Sound
    new ToggleButton(
      "",
      20,
      20,
      () => Settings.playsAudio,
      () => (Settings.playsAudio = !Settings.playsAudio),
      this.soundImage,
      this.disabledOverlay,
      true,
    ),
    // Area Sound
    new ToggleButton(
      "",
      20,
      60,
      () => Settings.playsAreaAudio,
      () => (Settings.playsAreaAudio = !Settings.playsAreaAudio),
      this.areaSoundImage,
      this.disabledOverlay,
      true,
    ),

    new ToggleButton(
      "Metronome",
      140,
      20,
      () => Settings.metronome,
      () => (Settings.metronome = !Settings.metronome),
    ),

    // Key bindings
    new KeyBindingButton(
      () => Settings.inventory_key,
      22,
      170,
      () => this.bindingKey === "inventory",
      () => this.startKeyBinding("inventory"),
      this.inventoryImage,
    ),
    new KeyBindingButton(
      () => Settings.spellbook_key,
      82,
      170,
      () => this.bindingKey === "spellbook",
      () => this.startKeyBinding("spellbook"),
      this.spellbookImage,
    ),
    new KeyBindingButton(
      () => Settings.prayer_key,
      142,
      170,
      () => this.bindingKey === "prayer",
      () => this.startKeyBinding("prayer"),
      this.prayerImage,
    ),
    new KeyBindingButton(
      () => Settings.equipment_key,
      22,
      220,
      () => this.bindingKey === "equipment",
      () => this.startKeyBinding("equipment"),
      this.equipmentImage,
    ),
    new KeyBindingButton(
      () => Settings.combat_key,
      82,
      220,
      () => this.bindingKey === "combat",
      () => this.startKeyBinding("combat"),
      this.combatImage,
    ),

    // Menu   
    new ToggleButton(
      "Menu",
      142,
      220,
      () => Settings.menuVisible,
      () => {
        Settings.menuVisible = !Settings.menuVisible;
        if (Settings.menuVisible) {
          document.getElementById("right_panel").classList.remove("hidden");
        } else {
          document.getElementById("right_panel").classList.add("hidden");
        }
        Viewport.viewport.calculateViewport();
      },
    ),
  ];

  constructor() {
    super();
    SettingsControls.instance = this;

    this.bindingKey = null;

    document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (this.bindingKey) {
        event.preventDefault();
        if (this.bindingKey === "inventory") {
          Settings.inventory_key = key;
        } else if (this.bindingKey === "spellbook") {
          Settings.spellbook_key = key;
        } else if (this.bindingKey === "prayer") {
          Settings.prayer_key = key;
        } else if (this.bindingKey === "equipment") {
          Settings.equipment_key = key;
        } else if (this.bindingKey === "combat") {
          Settings.combat_key = key;
        }
        this.bindingKey = null;
        setTimeout(() => {
          Settings.is_keybinding = false;
        }, 20);
        Settings.persistToStorage();
      }
    });
  }

  addComponent(component: Component) {
    this.components.push(component);
  }

  get isAvailable(): boolean {
    return true;
  }

  get appearsOnLeftInMobile(): boolean {
    return false;
  }

  startKeyBinding(key: string) {
    Settings.is_keybinding = true;
    this.bindingKey = key;
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("settings_key");
  }

  panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;

    if (x > 74 && x < 89 && y > 20 && y < 36) {
      Settings.maxUiScale += 0.05;
    } else if (x > 75 && x < 89 && y > 51 && y < 67) {
      Settings.maxUiScale -= 0.05;
    } else if (x > 100 && x < 115 && y > 20 && y < 36) {
      Settings.inputDelay += 20;
    } else if (x > 100 && x < 115 && y > 51 && y < 67) {
      Settings.inputDelay -= 20;
    } else {
      this.components.forEach((component) => {
        component.onPanelClick(x, y);
      });
    }

    Settings.inputDelay = Math.max(0, Settings.inputDelay);
    Settings.maxUiScale = Math.max(0.5, Math.min(1.5, Settings.maxUiScale));
    Settings.persistToStorage();
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    const scale = Settings.controlPanelScale;

    context.drawImage(
      this.redUpImage,
      x + 74 * scale,
      y + 20 * scale,
      this.redUpImage.width * scale,
      this.redUpImage.height * scale,
    );
    context.fillStyle = "#FFFF00";
    context.font = 16 * scale + "px OSRS";
    context.textAlign = "center";
    context.fillText(String(Math.round((Settings.maxUiScale - 1.0) * 100)) + "%", x + 79 * scale, y + 48 * scale);
    context.drawImage(
      this.greenDownImage,
      x + 74 * scale,
      y + 51 * scale,
      this.greenDownImage.width * scale,
      this.greenDownImage.height * scale,
    );
    context.fillText("UI", x + 80 * scale, y + 81 * scale);

    context.drawImage(
      this.redUpImage,
      x + 100 * scale,
      y + 20 * scale,
      this.redUpImage.width * scale,
      this.redUpImage.height * scale,
    );
    context.fillStyle = "#FFFF00";
    context.font = 16 * scale + "px OSRS";
    context.textAlign = "center";
    context.fillText(String(Settings.inputDelay), x + 106 * scale, y + 48 * scale);
    context.drawImage(
      this.greenDownImage,
      x + 100 * scale,
      y + 51 * scale,
      this.greenDownImage.width * scale,
      this.greenDownImage.height * scale,
    );
    context.fillText("Ping", x + 107 * scale, y + 81 * scale);

    if (this.bindingKey === null) {
      context.fillText("Key Bindings", x + 100 * scale, y + (133 + 30) * scale);
    } else {
      context.fillText("Press Key To Bind", x + 100 * scale, y + (133 + 30) * scale);
    }

    this.components.forEach((component) => {
      component.draw(context, scale, x, y);
    });
  }
}
