
import EquipmentPanel from "../../assets/images/panels/equipment.png";
import EquipmentTab from "../../assets/images/tabs/equipment.png";
import { BaseControls } from "./BaseControls";
import UsedSpotBackground from "../../assets/images/interface/equipment_spot_used.png"
import { BrowserUtils } from "../Utils/BrowserUtils";

export class EquipmentControls extends BaseControls{

  constructor(){
    super();
    this.usedSpotBackground = new Image();
    this.usedSpotBackground.src = UsedSpotBackground;
  }

  get panelImageReference() {
    return EquipmentPanel;
  }

  get tabImageReference() {
    return EquipmentTab;
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("equipment_key") || "1";
  }


  clickedPanel(region, x, y){

  }


  draw(region, ctrl, x, y) {
    super.draw(region, ctrl, x, y);

    if (region.player.weapon) {
      ctrl.ctx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      ctrl.ctx.drawImage(region.player.weapon.inventorySprite, x + 32, y + 92);
    }
  }
}