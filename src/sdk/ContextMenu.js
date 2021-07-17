import _ from "lodash";
import { Settings } from "./Settings";

export class ContextMenu {
  
  constructor() {
    this.isActive = false;
    this.location = { x: 0, y: 0 };
    this.cursorPosition = { x:0, y:0 }; 
    this.menuOptions = [];
    this.width = 0;
    this.height = 0;
    this.activatedPosition = { x: 0, y: 0 };
  }

  setPosition(position){
    this.location = position;
  }

  setActive() {
    this.isActive = true;
  }

  setInactive() {
    this.isActive = false;
  }

  setMenuOptions(menuOptions) {
    this.menuOptions = menuOptions;
  }
  
  cursorMovedTo(region, x, y){

    const cRect = region.canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    const canvasX = Math.round(x - cRect.left);  // Subtract the 'left' of the canvas 
    const canvasY = Math.round(y - cRect.top);   // from the X/Y positions to make  

    this.cursorPosition.x = canvasX;
    this.cursorPosition.y = canvasY;

    // cursor veering too far away, make inactive again
    if (Math.abs(canvasX - this.location.x) > this.width * 0.6) {
      this.setInactive();
    }
    if ((canvasY - this.location.y) < -10|| canvasY - this.location.y > this.height * 1.2){
      this.setInactive();
    }
  }


  draw(region) {


    if (this.isActive){
      this.linesOfText = [
        {
          text: [{text: "Choose Option", fillStyle: "#5f5445"}],
          action: () => {
            region.yellowClick();
          }
        },
        ...this.menuOptions,
        {
          text: [{text: "Walk Here", fillStyle: "white"}],
          action: () => {
            region.yellowClick();
            let x = this.location.x;
            let y = this.location.y;
            if (Settings.rotated === 'south') {
              x = region.width * Settings.tileSize - x;
              y = region.height * Settings.tileSize - y;
            }
            region.playerWalkClick(x, y);
          }
        },
        {
          text: [{text: "Cancel", fillStyle: "white"}],
          action: () => {
            region.yellowClick();
          }
        }
      ];
      region.ctx.font = "17px OSRS";

      this.width = 0;
      this.linesOfText.forEach((line) => {
         this.width = Math.max(this.width, this.fillMixedTextWidth(region.ctx, line.text) + 10);
      });

      this.height = 22 + (this.linesOfText.length - 1) * 20;

      region.ctx.fillStyle = "#5f5445";
      region.ctx.fillRect(this.location.x - this.width / 2, this.location.y, this.width, this.height);

      region.ctx.fillStyle = "black";
      region.ctx.fillRect(this.location.x - this.width / 2 + 1, this.location.y + 1, this.width - 2, 17);

      region.ctx.lineWidth = 1;
      region.ctx.strokeStyle = "black";
      region.ctx.strokeRect(this.location.x - this.width / 2 + 2, this.location.y + 20, this.width - 4, this.height - 22);

      for (let i=0; i<this.linesOfText.length;i++){
        this.drawLineOfText(region.ctx, this.linesOfText[i].text, this.width, i * 20);
      }
    }
    region.ctx.restore();
  }

  fillMixedText (ctx, args, x, y, inputColor) {

    let defaultFillStyle = ctx.fillStyle;
    let defaultFont = ctx.font;
  
    ctx.save();
    args.forEach(({ text, fillStyle, font }) => {
      if (fillStyle === 'white') {
        ctx.fillStyle = inputColor;
      }else{
        ctx.fillStyle = fillStyle || defaultFillStyle;
      }

      ctx.font = font || defaultFont;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    });
    ctx.restore();
  };
  fillMixedTextWidth (ctx, args) {
    let defaultFillStyle = ctx.fillStyle;
    let defaultFont = ctx.font;
  
    let x = 0;
    args.forEach(({ text, fillStyle, font }) => {
      ctx.fillStyle = fillStyle || defaultFillStyle;
      ctx.font = font || defaultFont;
      x += ctx.measureText(text).width;
    });
    return x;
  };

  drawLineOfText(ctx, text, width, y) {

    const isXAligned = this.cursorPosition.x > this.location.x - width / 2 && this.cursorPosition.x < this.location.x + width / 2;
    const isYAligned = this.cursorPosition.y > this.location.y + y + 2 && this.cursorPosition.y < this.location.y + 21 + y;
    const isHovered = isXAligned && isYAligned;

    this.fillMixedText(ctx, text, this.location.x - width / 2 + 4, this.location.y + 15 + y, isHovered ? "yellow" : "white");

  }

  clicked(region, x, y){
    const index = Math.floor((y - this.location.y) / 20);
    this.linesOfText[index].action();

  }
}