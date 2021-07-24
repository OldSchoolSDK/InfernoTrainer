import { ControlPanelController } from "../ControlPanelController";
import { Game } from "../Game";
import { ImageLoader } from "../Utils/ImageLoader";

export class BaseControls {
  panelImage: HTMLImageElement;
  tabImage: HTMLImageElement;
  selected: boolean;

  constructor () {
    
    this.panelImage = ImageLoader.createImage(this.panelImageReference)
    this.tabImage = ImageLoader.createImage(this.tabImageReference)

    this.selected = false
  }

  get keyBinding (): string {
    return '';
  }

  get panelImageReference (): string {
    return ''
  }

  get tabImageReference (): string {
    return ''
  }

  clickedPanel (game: Game, x: number, y: number) {
    console.log(x, y)
  }

  draw (game: Game, ctrl: ControlPanelController, x: number, y: number) {
    if (this.panelImage) {
      ctrl.ctx.drawImage(this.panelImage, x, y)
    }
  }
}
