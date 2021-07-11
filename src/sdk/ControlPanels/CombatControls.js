
import InventoryPanel from "../../assets/images/panels/inventory.png";
import CombatTab from "../../assets/images/tabs/combat.png";
import BaseControls from "./BaseControls";

export default class CombatControls extends BaseControls{

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return CombatTab;
  }

}