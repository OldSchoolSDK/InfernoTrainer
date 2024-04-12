import InventoryPanel from "../../assets/images/panels/inventory.png";
import EmptyTab from "../../assets/images/tabs/empty.png";
import { BaseControls } from "./BaseControls";

export class EmptyControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return EmptyTab;
  }
}
