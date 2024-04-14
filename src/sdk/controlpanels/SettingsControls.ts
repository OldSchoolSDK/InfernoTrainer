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

import InfernoIcon from "../../assets/images/settings/inferno.png";
import VerzikIcon from "../../assets/images/settings/verzik.png";
import XarpusIcon from "../../assets/images/settings/xarpus.png";

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

export class SettingsControls extends BaseControls {
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
  infernoImage: HTMLImageElement = ImageLoader.createImage(InfernoIcon);
  verzikImage: HTMLImageElement = ImageLoader.createImage(VerzikIcon);
  xarpusImage: HTMLImageElement = ImageLoader.createImage(XarpusIcon);
  inventoryImage: HTMLImageElement = ImageLoader.createImage(InventoryTab);
  spellbookImage: HTMLImageElement = ImageLoader.createImage(SpellbookTab);
  prayerImage: HTMLImageElement = ImageLoader.createImage(PrayerTab);
  equipmentImage: HTMLImageElement = ImageLoader.createImage(EquipmentTab);
  combatImage: HTMLImageElement = ImageLoader.createImage(CombatTab);
  bindingKey?: string;

  constructor() {
    super();

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

  get isAvailable(): boolean {
    return true;
  }

  get appearsOnLeftInMobile(): boolean {
    return false;
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("settings_key");
  }

  panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;

    if (x > 20 && x < 56 && y > 20 && y < 56) {
      Settings.playsAudio = !Settings.playsAudio;
    } else if (x > 20 && x < 56 && y > 60 && y < 86) {
      Settings.playsAreaAudio = !Settings.playsAreaAudio;
    } else if (x > 74 && x < 89 && y > 20 && y < 36) {
      Settings.maxUiScale += 0.05;
    } else if (x > 75 && x < 89 && y > 51 && y < 67) {
      Settings.maxUiScale -= 0.05;
    } else if (x > 100 && x < 115 && y > 20 && y < 36) {
      Settings.inputDelay += 20;
    } else if (x > 100 && x < 115 && y > 51 && y < 67) {
      Settings.inputDelay -= 20;
    } else if (x > 20 && x < 60 && y > 100 && y < 140) {
      Settings.displayPlayerLoS = !Settings.displayPlayerLoS;
    } else if (x > 80 && x < 120 && y > 100 && y < 140) {
      Settings.displayMobLoS = !Settings.displayMobLoS;
    } else if (x > 140 && x < 180 && y > 120 && y < 160) {
      // Settings.lockPOV = !Settings.lockPOV;
    } else if (x > 140 && x < 180 && y > 70 && y < 110) {
      Settings.displayFeedback = !Settings.displayFeedback;
    } else if (x > 140 && x < 180 && y > 20 && y < 60) {
      Settings.metronome = !Settings.metronome;
    } else if (x > 20 && x < 60 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = "inventory";
    } else if (x > 80 && x < 120 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = "spellbook";
    } else if (x > 140 && x < 180 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = "prayer";
    } else if (x > 20 && x < 60 && y > 220 && y < 260) {
      Settings.is_keybinding = true;
      this.bindingKey = "equipment";
    } else if (x > 80 && x < 120 && y > 220 && y < 260) {
      Settings.is_keybinding = true;
      this.bindingKey = "combat";
    } else if (x > 140 && x < 180 && y > 220 && y < 260) {
      Settings.menuVisible = !Settings.menuVisible;

      if (Settings.menuVisible) {
        document.getElementById("right_panel").classList.remove("hidden");
      } else {
        document.getElementById("right_panel").classList.add("hidden");
      }
      Viewport.viewport.calculateViewport();
    }

    Settings.inputDelay = Math.max(0, Settings.inputDelay);
    Settings.maxUiScale = Math.max(0.5, Math.min(1.5, Settings.maxUiScale));
    Settings.persistToStorage();
  }

  drawToggle(context: CanvasRenderingContext2D, x, y, image: HTMLImageElement, value: boolean) {
    context.drawImage(image, x, y, image.width * Settings.controlPanelScale, image.height * Settings.controlPanelScale);
    if (!value) {
      context.drawImage(
        this.disabledOverlay,
        x,
        y,
        image.width * Settings.controlPanelScale,
        image.height * Settings.controlPanelScale,
      );
    }
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    const scale = Settings.controlPanelScale;

    this.drawToggle(context, x + 20 * scale, y + 20 * scale, this.soundImage, Settings.playsAudio);
    this.drawToggle(context, x + 20 * scale, y + 60 * scale, this.areaSoundImage, Settings.playsAreaAudio);

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
    context.fillText("Lag", x + 107 * scale, y + 81 * scale);

    context.drawImage(
      Settings.displayPlayerLoS ? this.activeButtonImage : this.inactiveButtonImage,
      x + 20 * scale,
      y + 100 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.fillText("P LoS", x + 40 * scale, y + 125 * scale);

    context.drawImage(
      Settings.displayMobLoS ? this.activeButtonImage : this.inactiveButtonImage,
      x + 80 * scale,
      y + 100 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.fillText("M LoS", x + 100 * scale, y + 125 * scale);

    // context.drawImage(Settings.lockPOV ? this.activeButtonImage : this.inactiveButtonImage, x + 140 * scale, y + 120 * scale, this.activeButtonImage.width * scale, this.activeButtonImage.height * scale)
    // context.fillText('VP Lock', x + 160 * scale, y + 145 * scale)

    context.drawImage(
      Settings.displayFeedback ? this.activeButtonImage : this.inactiveButtonImage,
      x + 140 * scale,
      y + 70 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.fillText("Pray Ind.", x + 160 * scale, y + 95 * scale);

    context.drawImage(
      Settings.metronome ? this.activeButtonImage : this.inactiveButtonImage,
      x + 140 * scale,
      y + 20 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.fillText("Metronome", x + 160 * scale, y + 45 * scale);

    context.drawImage(
      this.bindingKey === "inventory" ? this.activeButtonImage : this.inactiveButtonImage,
      x + 22 * scale,
      y + 170 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.drawImage(
      this.inventoryImage,
      x + 25 * scale,
      y + 172 * scale,
      this.inventoryImage.width * scale,
      this.inventoryImage.height * scale,
    );
    context.fillText(Settings.inventory_key, x + (25 + 30) * scale, y + (172 + 30) * scale);

    context.drawImage(
      this.bindingKey === "spellbook" ? this.activeButtonImage : this.inactiveButtonImage,
      x + 82 * scale,
      y + 170 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.drawImage(
      this.spellbookImage,
      x + 85 * scale,
      y + 172 * scale,
      this.spellbookImage.width * scale,
      this.spellbookImage.height * scale,
    );
    context.fillText(Settings.spellbook_key, x + (85 + 30) * scale, y + (172 + 30) * scale);

    context.drawImage(
      this.bindingKey === "prayer" ? this.activeButtonImage : this.inactiveButtonImage,
      x + 142 * scale,
      y + 170 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.drawImage(
      this.prayerImage,
      x + 145 * scale,
      y + 172 * scale,
      this.prayerImage.width * scale,
      this.prayerImage.height * scale,
    );
    context.fillText(Settings.prayer_key, x + (145 + 30) * scale, y + (172 + 30) * scale);

    context.drawImage(
      this.bindingKey === "equipment" ? this.activeButtonImage : this.inactiveButtonImage,
      x + 22 * scale,
      y + 220 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.drawImage(
      this.equipmentImage,
      x + 25 * scale,
      y + 222 * scale,
      this.equipmentImage.width * scale,
      this.equipmentImage.height * scale,
    );
    context.fillText(Settings.equipment_key, x + (25 + 30) * scale, y + (222 + 30) * scale);

    context.drawImage(
      this.bindingKey === "combat" ? this.activeButtonImage : this.inactiveButtonImage,
      x + 82 * scale,
      y + 220 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.drawImage(
      this.combatImage,
      x + 85 * scale,
      y + 222 * scale,
      this.combatImage.width * scale,
      this.combatImage.height * scale,
    );
    context.fillText(Settings.combat_key, x + (85 + 30) * scale, y + (222 + 30) * scale);

    context.drawImage(
      Settings.menuVisible ? this.activeButtonImage : this.inactiveButtonImage,
      x + 142 * scale,
      y + 220 * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    context.fillText("Menu", x + 163 * scale, y + 241 * scale);

    if (this.bindingKey === null) {
      context.fillText("Key Bindings", x + 100 * scale, y + (133 + 30) * scale);
    } else {
      context.fillText("Press Key To Bind", x + 100 * scale, y + (133 + 30) * scale);
    }
  }
}
