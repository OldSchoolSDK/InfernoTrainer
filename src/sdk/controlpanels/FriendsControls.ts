import InventoryPanel from "../../assets/images/panels/inventory.png";
import FriendsTab from "../../assets/images/tabs/friends.png";
import { BaseControls } from "./BaseControls";

export class FriendsControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return FriendsTab;
  }
}
