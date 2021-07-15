

import StandardSpellbookTab from "../../assets/images/tabs/standard_spellbook.png";
import AncientsPanel from "../../assets/images/panels/ancients.png";
import { BaseControls } from "./BaseControls";
import { BarrageMagicWeapon } from "../Weapons/BarrageMagicWeapon";
import { BrowserUtils } from "../Utils/BrowserUtils";

export class AncientsSpellbookControls extends BaseControls{

  get panelImageReference() {
    return AncientsPanel;
  }

  get tabImageReference() {
     // Need to extract the other images later
    return StandardSpellbookTab;
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("spellbook_key") || "2";
  }


  clickedPanel(region, x, y){


    if (x >= 21 && x <= 42){
      if (y >= 229 && y <= 249) {
        region.player.manualSpellCastSelection = new BarrageMagicWeapon();
        return;
      }
    }
  }


  draw(region, ctrl, x, y) {
    ctrl.ctx.drawImage(this.panelImage, x, y);

    if (region.player.manualSpellCastSelection) {
      ctrl.ctx.fillStyle = "#D1BB7773";
      ctrl.ctx.fillRect( 47, 225, 21, 21);
    }
  }

}
