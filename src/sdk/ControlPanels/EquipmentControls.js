
import EquipmentPanel from "../../assets/images/panels/equipment.png";
import EquipmentTab from "../../assets/images/tabs/equipment.png";
import BaseControls from "./BaseControls";
import UsedSpotBackground from "../../assets/images/interface/equipment_spot_used.png"

export default class EquipmentControls extends BaseControls{

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


  clickedPanel(stage, x, y){

  }


  draw(stage, ctrl, x, y) {
    super.draw(stage, ctrl, x, y);

    if (stage.player.weapon) {
      ctrl.ctx.drawImage(this.usedSpotBackground, x + 28, y + 89)
      ctrl.ctx.drawImage(stage.player.weapon.inventorySprite, x + 32, y + 92);
    }
  }
}