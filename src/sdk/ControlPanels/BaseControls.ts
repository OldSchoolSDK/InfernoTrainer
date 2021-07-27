import { ControlPanelController } from "../ControlPanelController";
import { Game } from "../Game";
import { ImageLoader } from "../Utils/ImageLoader";

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

  clickedPanel (game: Game, x: number, y: number) {
    console.log(x, y)
  }

  draw (game: Game, ctrl: ControlPanelController, x: number, y: number) {
    if (this.panelImage) {
      console.log('drawing')
      game.ctx.drawImage(this.panelImage, x, y)
    }
  }
}
