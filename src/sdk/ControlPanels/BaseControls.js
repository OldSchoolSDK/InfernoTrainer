
export default class BaseControls {
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

  setUnselected(){
    this.selected = false;
  }

  clickedTab() {
    this.selected = !this.selected;
  }

  clickedPanel(x, y){

  }

  draw(ctx, x, y) {
    ctx.drawImage(this.panelImage, x, y);
    
  }

}