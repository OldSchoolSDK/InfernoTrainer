import InventoryPanel from "../../assets/images/panels/inventory.png";
import StandardSpellbookTab from "../../assets/images/tabs/standard_spellbook.png";
import { BaseControls } from "./BaseControls";

export class StandardSpellbookControls extends BaseControls {
  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return StandardSpellbookTab;
  }
}
