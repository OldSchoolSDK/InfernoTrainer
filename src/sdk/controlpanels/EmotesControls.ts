import InventoryPanel from "../../assets/images/panels/inventory.png";
import EmotesTab from "../../assets/images/tabs/emotes.png";
import { BaseControls } from "./BaseControls";

export class EmotesControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return EmotesTab;
  }
}
