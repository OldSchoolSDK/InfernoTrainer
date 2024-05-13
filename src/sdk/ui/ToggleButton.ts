import { Component } from "./Component";
import { ImageLoader } from "../utils/ImageLoader";

import ButtonActiveIcon from "../../assets/images/interface/button_active.png";
import ButtonInactiveIcon from "../../assets/images/interface/button_inactive.png";

const ACTIVE_BUTTON_IMAGE: HTMLImageElement = ImageLoader.createImage(ButtonActiveIcon);
const INACTIVE_BUTTON_IMAGE: HTMLImageElement = ImageLoader.createImage(ButtonInactiveIcon);

export class ToggleButton implements Component {
  constructor(
    private label: string,
    private xOffset: number,
    private yOffset: number,
    private isActive: () => boolean,
    private onClick: () => void,
    private activeButtonImage = ACTIVE_BUTTON_IMAGE,
    private inactiveButtonImage = INACTIVE_BUTTON_IMAGE,
    private overlayInactive = false,
  ) {}

  draw(context: CanvasRenderingContext2D, scale: number, panelX: number, panelY: number) {
    const active = this.isActive();
    context.drawImage(
      active || this.overlayInactive ? this.activeButtonImage : this.inactiveButtonImage,
      panelX + this.xOffset * scale,
      panelY + this.yOffset * scale,
      this.activeButtonImage.width * scale,
      this.activeButtonImage.height * scale,
    );
    if (this.overlayInactive && !active) {
      context.drawImage(
        this.inactiveButtonImage,
        panelX + this.xOffset * scale,
        panelY + this.yOffset * scale,
        this.inactiveButtonImage.width * scale,
        this.inactiveButtonImage.height * scale,
      );
    }
    context.save();
    context.fillStyle = "#FFFF00";
    context.font = 16 * scale + "px OSRS";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
      this.label,
      panelX + (this.xOffset + this.activeButtonImage.width / 2) * scale,
      panelY + (this.yOffset + ACTIVE_BUTTON_IMAGE.height / 2) * scale,
    );
    context.restore();
  }

  onPanelClick(x: number, y: number) {
    if (
      x >= this.xOffset &&
      x <= this.xOffset + this.activeButtonImage.width &&
      y >= this.yOffset &&
      y <= this.yOffset + this.activeButtonImage.height
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
