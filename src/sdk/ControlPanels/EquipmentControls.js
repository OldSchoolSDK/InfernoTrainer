
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

}