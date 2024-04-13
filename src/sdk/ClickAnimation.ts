import YellowX1 from "../assets/images/interface/yellow_x_1.png";
import YellowX2 from "../assets/images/interface/yellow_x_2.png";
import YellowX3 from "../assets/images/interface/yellow_x_3.png";
import YellowX4 from "../assets/images/interface/yellow_x_4.png";

import RedX1 from "../assets/images/interface/red_x_1.png";
import RedX2 from "../assets/images/interface/red_x_2.png";
import RedX3 from "../assets/images/interface/red_x_3.png";
import RedX4 from "../assets/images/interface/red_x_4.png";
import { Settings } from "./Settings";
import { ImageLoader } from "./utils/ImageLoader";
import { Viewport } from "./Viewport";

interface ClickAnimationFrames {
  red: HTMLImageElement[];
  yellow: HTMLImageElement[];
}

export class ClickAnimation {
  color: string;
  x: number;
  y: number;
  ttl: number;

  constructor(color: string, x: number, y: number) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.ttl = 1;
  }

  static frames: ClickAnimationFrames = {
    red: [
      ImageLoader.createImage(RedX1),
      ImageLoader.createImage(RedX2),
      ImageLoader.createImage(RedX3),
      ImageLoader.createImage(RedX4),
    ],
    yellow: [
      ImageLoader.createImage(YellowX1),
      ImageLoader.createImage(YellowX2),
      ImageLoader.createImage(YellowX3),
      ImageLoader.createImage(YellowX4),
    ],
  };

  draw() {
    if (this.ttl <= 0) {
      return;
    }
    const frameNumber = Math.floor((1 - this.ttl) * 4);
    const frames = this.color === "red" ? ClickAnimation.frames.red : ClickAnimation.frames.yellow;
    Viewport.viewport.context.drawImage(frames[frameNumber], this.x - 9, this.y - 9);

    this.ttl -= 1.65 / Settings.fps;
  }
}
