
import EquipmentPanel from "../../assets/images/panels/equipment.png";
import EquipmentTab from "../../assets/images/tabs/equipment.png";
import BaseControls from "./BaseControls";

export default class EquipmentControls extends BaseControls{

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
    console.log('ay');

    super.draw(stage, ctrl, x, y);

    if (stage.player.weapon) {
      ctrl.ctx.drawImage(stage.player.weapon.inventorySprite, 58, 92);
    }
  }
}