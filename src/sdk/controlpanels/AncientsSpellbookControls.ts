import StandardSpellbookTab from "../../assets/images/tabs/standard_spellbook.png";
import AncientsPanel from "../../assets/images/panels/ancients.png";
import { BaseControls } from "./BaseControls";
import { IceBarrageSpell } from "../weapons/IceBarrageSpell";
import { BloodBarrageSpell } from "../weapons/BloodBarrageSpell";
import { Settings } from "../Settings";
import { ControlPanelController } from "../ControlPanelController";
import { ItemName } from "../ItemName";
import { Viewport } from "../Viewport";

export class AncientsSpellbookControls extends BaseControls {
  get panelImageReference() {
    return AncientsPanel;
  }

  get tabImageReference() {
    // Need to extract the other images later
    return StandardSpellbookTab;
  }

  get keyBinding() {
    return Settings.spellbook_key;
  }

  get isAvailable(): boolean {
    return true;
  }

  panelClickDown(x: number, y: number) {
    Viewport.viewport.player.manualSpellCastSelection = null;
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;
    if (x >= 21 && x <= 42 && y >= 229 && y <= 249) {
      Viewport.viewport.player.manualSpellCastSelection = new IceBarrageSpell();
    } else if (x >= 166 && x <= 187 && y >= 194 && y <= 214) {
      Viewport.viewport.player.manualSpellCastSelection = new BloodBarrageSpell();
    }
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    Viewport.viewport.context.fillStyle = "#D1BB7773";

    const scale = Settings.controlPanelScale;
    if (Viewport.viewport.player.manualSpellCastSelection) {
      if (Viewport.viewport.player.manualSpellCastSelection.itemName === ItemName.ICE_BARRAGE) {
        Viewport.viewport.context.fillRect(x + 20 * scale, y + 225 * scale, 21 * scale, 21 * scale);
      } else if (Viewport.viewport.player.manualSpellCastSelection.itemName === ItemName.BLOOD_BARRAGE) {
        Viewport.viewport.context.fillRect(x + 164 * scale, y + 188 * scale, 21 * scale, 21 * scale);
      }
    }
  }
}
