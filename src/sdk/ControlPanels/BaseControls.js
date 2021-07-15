
export class BaseControls {
  constructor() {

    this.panelImage = new Image(204, 275);
    this.panelImage.src = this.panelImageReference;

    this.tabImage = new Image(33, 36);
    this.tabImage.src = this.tabImageReference;

    this.selected = false;
  }

  get panelImageReference() {
    return null;
  }

  get tabImageReference() {
    return null;
  }

  clickedPanel(region, x, y){
    console.log(x, y);
  }

  draw(region, ctrl, x, y) {
    ctrl.ctx.drawImage(this.panelImage, x, y);
  }

}