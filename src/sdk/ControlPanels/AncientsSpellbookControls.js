

import StandardSpellbookTab from "../../assets/images/tabs/standard_spellbook.png";
import AncientsPanel from "../../assets/images/panels/ancients.png";
import BaseControls from "./BaseControls";
import BarrageMagicWeapon from "../Weapons/BarrageMagicWeapon";

export default class AncientsSpellbookControls extends BaseControls{

  get panelImageReference() {
    return AncientsPanel;
  }

  get tabImageReference() {
     // Need to extract the other images later
    return StandardSpellbookTab;
  }

  clickedPanel(stage, x, y){


    if (x >= 21 && x <= 42){
      if (y >= 229 && y <= 249) {
        stage.player.manualSpellCastSelection = new BarrageMagicWeapon();
        return;
      }
    }
  }


  draw(stage, ctrl, x, y) {
    ctrl.ctx.drawImage(this.panelImage, x, y);

    if (stage.player.manualSpellCastSelection) {
      ctrl.ctx.fillStyle = "#D1BB7773";
      ctrl.ctx.fillRect( 47, 225, 21, 21);
    }
  }

}
