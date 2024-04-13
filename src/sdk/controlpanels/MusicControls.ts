import InventoryPanel from "../../assets/images/panels/inventory.png";
import MusicTab from "../../assets/images/tabs/music.png";
import { BaseControls } from "./BaseControls";

export class MusicControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return MusicTab;
  }
}
