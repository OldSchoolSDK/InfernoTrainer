import { ControlPanelController } from "../ControlPanelController";
import { ImageLoader } from "../utils/ImageLoader";
import { Settings } from "../Settings";
import { Viewport } from "../Viewport";

export class BaseControls {
  panelImage: HTMLImageElement = ImageLoader.createImage(this.panelImageReference);
  tabImage: HTMLImageElement = ImageLoader.createImage(this.tabImageReference);
  selected = false;

  get keyBinding(): string {
    return "";
  }

  get isAvailable(): boolean {
    return false;
  }

  get panelImageReference(): string {
    return "";
  }

  get tabImageReference(): string {
    return "";
  }

  get appearsOnLeftInMobile(): boolean {
    return true;
  }

  cursorMovedto(x: number, y: number) {
    // Override me
  }

  panelRightClick(x: number, y: number) {
    // Override me
  }

  panelClickDown(x: number, y: number) {
    //
  }
  panelClickUp(x: number, y: number) {
    //
  }

  draw(context: CanvasRenderingContext2D, ctrl: ControlPanelController, x: number, y: number) {
    const scale = Settings.controlPanelScale;
    if (this.panelImage) {
      context.drawImage(this.panelImage, x, y, 204 * scale, 275 * scale);
    }
  }
}
