
import StatsPanel from "../../assets/images/panels/stats.png";
import StatsTab from "../../assets/images/tabs/stats.png";
import BaseControls from "./BaseControls";

export default class StatsControls extends BaseControls{

  get panelImageReference() {
    return StatsPanel;
  }

  get tabImageReference() {
    return StatsTab;
  }

}
