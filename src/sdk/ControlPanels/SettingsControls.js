import { BaseControls } from "./BaseControls";

import InventoryPanel from "../../assets/images/panels/inventory.png";
import SettingsTab from "../../assets/images/tabs/settings.png";

import MusicOnIcon from "../../assets/images/interface/button_music_on.png"
import MusicOffIcon from "../../assets/images/interface/button_music_off.png"
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
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("settings_key") || "5";
  }


  clickedPanel(region, x, y){
    if (x > 20 && x < 56 && y > 20 && y < 56) {
      Settings.playsAudio = !Settings.playsAudio;
    }
    Settings.persistToStorage();
  }


  draw(region, ctrl, x, y) {
    super.draw(region, ctrl, x, y);

    console.log(Settings.playsAudio)
    ctrl.ctx.drawImage(Settings.playsAudio ? this.musicOnImage : this.musicOffImage, x + 20, y + 20);

  }
}
