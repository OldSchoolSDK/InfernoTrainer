import PrayerPanel from "../../assets/images/panels/prayer.png";
import PrayerTab from "../../assets/images/tabs/prayer.png";
import { BaseControls } from "./BaseControls";
import { Settings } from "../Settings";
import { ControlPanelController } from "../ControlPanelController";
import { Trainer } from "../Trainer";

export class PrayerControls extends BaseControls {
  hasQuickPrayersActivated = false;

  get panelImageReference() {
    return PrayerPanel;
  }

  get tabImageReference() {
    return PrayerTab;
  }

  get keyBinding() {
    return Settings.prayer_key;
  }

  deactivateAllPrayers() {
    this.hasQuickPrayersActivated = false;
    Trainer.player.prayerController.activePrayers().forEach((prayer) => prayer.deactivate());
  }

  activateQuickPrayers() {
    this.hasQuickPrayersActivated = true;

    Trainer.player.prayerController.prayers.forEach((prayer) => {
      prayer.deactivate();
      if (prayer.name === "Protect from Magic") {
        prayer.activate(Trainer.player);
      }
      if (prayer.name === "Rigour") {
        prayer.activate(Trainer.player);
      }
    });
  }

  panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;

    const gridX = x - 14;
    const gridY = y - 22;

    const clickedPrayer =
      Trainer.player.prayerController.prayers[Math.floor(gridY / 35) * 5 + Math.floor(gridX / 35)];
    if (clickedPrayer && Trainer.player.currentStats.prayer > 0) {
      clickedPrayer.toggle(Trainer.player);

      if (this.hasQuickPrayersActivated && Trainer.player.prayerController.activePrayers().length === 0) {
        ControlPanelController.controls.PRAYER.hasQuickPrayersActivated = false;
      }
    }
  }

  get isAvailable(): boolean {
    return true;
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    const scale = Settings.controlPanelScale;

    Trainer.player.prayerController.prayers.forEach((prayer, index) => {
      const x2 = index % 5;
      const y2 = Math.floor(index / 5);

      if (prayer.isActive || prayer.isLit) {
        context.beginPath();
        context.fillStyle = "#D1BB7773";
        context.arc(
          x + 10 * scale + (x2 + 0.5) * 36.8 * scale,
          y + (16 + (y2 + 0.5) * 37) * scale,
          18 * scale,
          0,
          2 * Math.PI,
        );
        context.fill();
      }
      if (Trainer.player.stats.prayer < prayer.levelRequirement()) {
        context.beginPath();
        context.fillStyle = "#00000073";
        context.arc(
          x + 10 * scale + (x2 + 0.5) * 36.8 * scale,
          y + (16 + (y2 + 0.5) * 37) * scale,
          18 * scale,
          0,
          2 * Math.PI,
        );
        context.fill();
      }
    });
  }
}
