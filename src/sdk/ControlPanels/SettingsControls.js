import { BaseControls } from "./BaseControls";

import InventoryPanel from "../../assets/images/panels/inventory.png";
import SettingsTab from "../../assets/images/tabs/settings.png";

import MusicOnIcon from "../../assets/images/interface/button_music_on.png"
import MusicOffIcon from "../../assets/images/interface/button_music_off.png"

import ButtonRedUpIcon from "../../assets/images/interface/button_red_up.png"
import ButtonGreenDownIcon from "../../assets/images/interface/button_green_down.png"
import CompassIcon from "../../assets/images/interface/compass.png"

import {Settings} from "../Settings";

export class SettingsControls extends BaseControls{

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return SettingsTab;
  }

  constructor(){
    super();
    this.musicOnImage = new Image();
    this.musicOnImage.src = MusicOnIcon;
    this.musicOffImage = new Image();
    this.musicOffImage.src = MusicOffIcon;
    this.redUpImage = new Image();
    this.redUpImage.src = ButtonRedUpIcon;
    this.greenDownImage = new Image();
    this.greenDownImage.src = ButtonGreenDownIcon;
    this.compassImage = new Image();
    this.compassImage.src = CompassIcon;

    this.compassImage.addEventListener('load', () => {
      console.log('load', this);
      this.compassCanvas = new OffscreenCanvas(51, 51);

      const context = this.compassCanvas.getContext("2d");


      context.drawImage(this.compassImage, 0, 0);

      // only draw image where mask is
      context.globalCompositeOperation = "destination-in";

      // draw our circle mask
      context.fillStyle = "#000";
      context.beginPath();
      const size = 38;
      context.arc(
        (51 - size) * 0.5 + size * 0.5, // x
        (51 - size) * 0.5 + size * 0.5, // y
        size * 0.5, // radius
        0, // start angle
        2 * Math.PI // end angle
      );
      context.fill();

      // restore to default composite operation (is draw over current image)
      context.globalCompositeOperation = "source-over";

    });

  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("settings_key") || "5";
  }


  clickedPanel(region, x, y){
    if (x > 20 && x < 56 && y > 20 && y < 56) {
      Settings.playsAudio = !Settings.playsAudio;
    }else if (x > 75 && x < 91 && y > 20 && y < 36) {
      Settings.inputDelay += 20;
    }else if (x > 75 && x < 91 && y > 51 && y < 67) {
      Settings.inputDelay -= 20;
    }else if (x > 100 && x < 138 && y > 20 && y < 58) {
      if (Settings.rotated  === 'south'){
        Settings.rotated = 'north';
      }else{
        Settings.rotated = 'south';
      }

    }
    

    Settings.inputDelay = Math.max(0, Settings.inputDelay);
    Settings.persistToStorage();
  }


  draw(region, ctrl, x, y) {
    super.draw(region, ctrl, x, y);

    ctrl.ctx.drawImage(Settings.playsAudio ? this.musicOnImage : this.musicOffImage, x + 20, y + 20);


    ctrl.ctx.drawImage(this.redUpImage, x + 75, y + 20);
    ctrl.ctx.fillStyle = "#FFFF0066";
    ctrl.ctx.font = "16px OSRS";
    ctrl.ctx.textAlign = "center";
    ctrl.ctx.fillText(Settings.inputDelay, x + 81, y + 48);
    ctrl.ctx.drawImage(this.greenDownImage, x + 75, y + 51);

    if (this.compassCanvas){
      ctrl.ctx.drawImage(this.compassCanvas, x + 100, y + 20)

    }

  }
}
