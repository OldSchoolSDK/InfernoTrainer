import InventoryPanel from "../../assets/images/panels/inventory.png";
import QuestsTab from "../../assets/images/tabs/quests.png";
import { BaseControls } from "./BaseControls";

export class QuestsControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return QuestsTab;
  }
}
