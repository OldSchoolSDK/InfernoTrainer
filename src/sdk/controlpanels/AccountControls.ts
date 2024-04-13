import InventoryPanel from "../../assets/images/panels/inventory.png";
import AccountTab from "../../assets/images/tabs/account.png";
import { BaseControls } from "./BaseControls";

export class AccountControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return AccountTab;
  }
}
