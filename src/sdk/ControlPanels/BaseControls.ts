import { ControlPanelController } from "../ControlPanelController";
import { World } from "../World";
import { ImageLoader } from "../utils/ImageLoader";

export class BaseControls {
  panelImage: HTMLImageElement = ImageLoader.createImage(this.panelImageReference)
  tabImage: HTMLImageElement = ImageLoader.createImage(this.tabImageReference)
  selected: boolean = false;

  get keyBinding (): string {
    return '';
  }

  get panelImageReference (): string {
    return ''
  }

  get tabImageReference (): string {
    return ''
  }

  clickedPanel (world: World, x: number, y: number) {
    console.log(x, y)
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    if (this.panelImage) {
      world.viewportCtx.drawImage(this.panelImage, x, y)
    }
  }
}
