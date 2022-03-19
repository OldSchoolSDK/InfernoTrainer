
import StandardSpellbookTab from '../../assets/images/tabs/standard_spellbook.png'
import AncientsPanel from '../../assets/images/panels/ancients.png'
import { BaseControls } from './BaseControls'
import { IceBarrageSpell } from '../weapons/IceBarrageSpell'
import { BloodBarrageSpell } from '../weapons/BloodBarrageSpell'
import { Settings } from '../Settings'
import { World } from '../World'
import { ControlPanelController } from '../ControlPanelController'
import { ItemName } from '../ItemName'

export class AncientsSpellbookControls extends BaseControls {
  get panelImageReference () {
    return AncientsPanel
  }

  get tabImageReference () {
    // Need to extract the other images later
    return StandardSpellbookTab
  }

  get keyBinding () {
    return Settings.spellbook_key
  }

  panelClickDown (world: World, x: number, y: number) {
    world.player.manualSpellCastSelection = null;
    let scale = 0.5;

    x = x / scale;
    y = y / scale;
    if (x >= 21 && x <= 42 && y >= 229 && y <= 249) {
      world.player.manualSpellCastSelection = new IceBarrageSpell()
    }else if (x >= 166 && x <= 187 && y >= 194 && y <= 214) {
      world.player.manualSpellCastSelection = new BloodBarrageSpell()
    }
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y);
    world.viewport.context.fillStyle = '#D1BB7773'

    let scale = 0.5;
    if (world.player.manualSpellCastSelection) {
      if (world.player.manualSpellCastSelection.itemName === ItemName.ICE_BARRAGE) {
          world.viewport.context.fillRect(x + 20 * scale, y + 225 * scale, 21 * scale, 21 * scale)
      }else if (world.player.manualSpellCastSelection.itemName === ItemName.BLOOD_BARRAGE) {
        world.viewport.context.fillRect(x + 164 * scale, y+ 188 * scale, 21 * scale, 21 * scale)
      }
    }
  }
}
