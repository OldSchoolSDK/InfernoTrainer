import { ControlPanelController } from "../ControlPanelController";
import { Game } from "../Game";

export class BaseControls {
  panelImage: HTMLImageElement;
  tabImage: HTMLImageElement;
  selected: boolean;

  constructor () {
    const panelImage = new Image(204, 275)
    panelImage.src = this.panelImageReference
    panelImage.onload = () => {
      this.panelImage = panelImage;
    }

    const tabImage = new Image(33, 36)
    tabImage.src = this.tabImageReference
    tabImage.onload = () => {
      this.tabImage = tabImage;
    }

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
