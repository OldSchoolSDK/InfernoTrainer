import YellowX1 from "../assets/images/interface/yellow_x_1.png";
import YellowX2 from "../assets/images/interface/yellow_x_2.png";
import YellowX3 from "../assets/images/interface/yellow_x_3.png";
import YellowX4 from "../assets/images/interface/yellow_x_4.png";

import RedX1 from "../assets/images/interface/red_x_1.png";
import RedX2 from "../assets/images/interface/red_x_2.png";
import RedX3 from "../assets/images/interface/red_x_3.png";
import RedX4 from "../assets/images/interface/red_x_4.png";


export default class ClickAnimation {

  constructor(color, x, y) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.ttl = 1;

    if (!ClickAnimation.frames){
      ClickAnimation.setFrames();
    }
  }

  static frames;
  static createImage(url) {
    const image = new Image();
    image.src = url;
    return image;
  }

  static setFrames() {
    ClickAnimation.frames = {
      red: [
        ClickAnimation.createImage(RedX1),
        ClickAnimation.createImage(RedX2),
        ClickAnimation.createImage(RedX3),
        ClickAnimation.createImage(RedX4)
      ],
      yellow: [
        ClickAnimation.createImage(YellowX1),
        ClickAnimation.createImage(YellowX2),
        ClickAnimation.createImage(YellowX3),
        ClickAnimation.createImage(YellowX4)
      ]
    }
  }

  draw(stage, framePercent) {
    if (this.ttl <= 0) {
      return;
    }
    const frameNumber = Math.floor((1-this.ttl) * 4) 
    stage.ctx.drawImage(
      ClickAnimation.frames[this.color][frameNumber],
      this.x - 9,
      this.y - 9
    );

    this.ttl -=0.06;


  }
}