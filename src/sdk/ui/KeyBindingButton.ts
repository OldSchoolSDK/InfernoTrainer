import { Component } from "./Component";
import { ImageLoader } from "../utils/ImageLoader";

import ButtonActiveIcon from "../../assets/images/interface/button_active.png";
import ButtonInactiveIcon from "../../assets/images/interface/button_inactive.png";

const ACTIVE_BUTTON_IMAGE: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon);
const INACTIVE_BUTTON_IMAGE: HTMLImageElement = ImageLoader.createImage(ButtonInactiveIcon);

export class KeyBindingButton implements Component {
  constructor(
    private label: () => string,
    private xOffset: number,
    private yOffset: number,
    private isActive: () => boolean,
    private onClick: () => void,
    private overlay: HTMLImageElement,
  ) {}

  draw(context: CanvasRenderingContext2D, scale: number, panelX: number, panelY: number) {
    const active = this.isActive();
    context.drawImage(
      active ? ACTIVE_BUTTON_IMAGE : INACTIVE_BUTTON_IMAGE,
      panelX + this.xOffset * scale,
      panelY + this.yOffset * scale,
      ACTIVE_BUTTON_IMAGE.width * scale,
      ACTIVE_BUTTON_IMAGE.height * scale,
    );
    context.drawImage(
      this.overlay,
      panelX + this.xOffset * scale + 3,
      panelY + this.yOffset * scale + 2,
      this.overlay.width * scale,
      this.overlay.height * scale,
    );
    context.save();
    context.fillStyle = "#FFFF00";
    context.font = 16 * scale + "px OSRS";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
      this.label(),
      panelX + (this.xOffset + 30) * scale,
      panelY + (this.yOffset + 30) * scale,
    );
    context.restore();
  }

  onPanelClick(x: number, y: number) {
    if (
      x >= this.xOffset &&
      x <= this.xOffset + ACTIVE_BUTTON_IMAGE.width &&
      y >= this.yOffset &&
      y <= this.yOffset + ACTIVE_BUTTON_IMAGE.height
    ) {
      this.onClick();
      return true;
    }
    return false;
  }

  onMouseMove(x: number, y: number) {
    return false;
  }
}
