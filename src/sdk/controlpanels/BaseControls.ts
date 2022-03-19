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

  get appearsOnLeftInMobile (): boolean {
    return true;
  }
  
  cursorMovedto(world: World, x: number, y: number) {
  }

  panelRightClick (world: World, x: number, y: number) {
    
  }

  panelClickDown (world: World, x: number, y: number) {
    console.log(x, y)
  }
  panelClickUp (world: World, x: number, y: number) {
    console.log(x, y)
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    let scale = 0.9;
    if (this.panelImage) {
      world.viewport.context.drawImage(this.panelImage, x, y, 204 * scale, 275 * scale)
    }
  }
}
