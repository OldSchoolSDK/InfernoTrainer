import _ from "lodash";
import { Point } from "./Utils/Point";

export class ContextMenu {
  
  constructor() {
    this.isActive = false;
    this.position = { x: 0, y: 0 };
    this.cursorPosition = { x:0, y:0 }; 
    this.menuOptions = [];
    this.width = 0;
    this.height = 0;
    this.activatedPosition = { x: 0, y: 0 };
  }

  setPosition(position){
    this.position = position;
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
  
  cursorMovedTo(stage, x, y){

    const cRect = stage.map.getBoundingClientRect();        // Gets CSS pos, and width/height
    const canvasX = Math.round(x - cRect.left);  // Subtract the 'left' of the canvas 
    const canvasY = Math.round(y - cRect.top);   // from the X/Y positions to make  

    this.cursorPosition.x = canvasX;
    this.cursorPosition.y = canvasY;

    // cursor veering too far away, make inactive again
    if (Math.abs(canvasX - this.position.x) > this.width * 0.6) {
      this.setInactive();
    }
    if ((canvasY - this.position.y) < -10|| canvasY - this.position.y > this.height * 1.2){
      this.setInactive();
    }
  }


  draw(stage) {

    if (this.isActive){
      this.linesOfText = [
        {
          text: [{text: "Choose Option", fillStyle: "#5f5445"}],
          action: () => {
            stage.yellowClick();
          }
        },
        ...this.menuOptions,
        {
          text: [{text: "Walk Here", fillStyle: "white"}],
          action: () => {
            stage.yellowClick();
            stage.playerWalkClick(this.position.x, this.position.y);
          }
        },
        {
          text: [{text: "Cancel", fillStyle: "white"}],
          action: () => {
            stage.yellowClick();
          }
        }
      ];
      stage.ctx.font = "17px OSRS";

      this.width = 0;
      this.linesOfText.forEach((line) => {
         this.width = Math.max(this.width, this.fillMixedTextWidth(stage.ctx, line.text) + 10);
      });

      this.height = 22 + (this.linesOfText.length - 1) * 20;

      stage.ctx.fillStyle = "#5f5445";
      stage.ctx.fillRect(this.position.x - this.width / 2, this.position.y, this.width, this.height);

      stage.ctx.fillStyle = "black";
      stage.ctx.fillRect(this.position.x - this.width / 2 + 1, this.position.y + 1, this.width - 2, 17);

      stage.ctx.lineWidth = 1;
      stage.ctx.strokeStyle = "black";
      stage.ctx.strokeRect(this.position.x - this.width / 2 + 2, this.position.y + 20, this.width - 4, this.height - 22);

      for (let i=0; i<this.linesOfText.length;i++){
        this.drawLineOfText(stage.ctx, this.linesOfText[i].text, this.width, i * 20);
      }
    }
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

    const isXAligned = this.cursorPosition.x > this.position.x - width / 2 && this.cursorPosition.x < this.position.x + width / 2;
    const isYAligned = this.cursorPosition.y > this.position.y + y + 2 && this.cursorPosition.y < this.position.y + 21 + y;
    const isHovered = isXAligned && isYAligned;

    this.fillMixedText(ctx, text, this.position.x - width / 2 + 4, this.position.y + 15 + y, isHovered ? "yellow" : "white");

  }

  clicked(stage, x, y){
    const index = Math.floor((y - this.position.y) / 20);
    this.linesOfText[index].action();

  }
}