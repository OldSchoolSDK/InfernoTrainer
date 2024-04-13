import InventoryPanel from "../../assets/images/panels/inventory.png";
import ClanChatTab from "../../assets/images/tabs/clanchat.png";
import { BaseControls } from "./BaseControls";

export class ClanChatControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return ClanChatTab;
  }
}
