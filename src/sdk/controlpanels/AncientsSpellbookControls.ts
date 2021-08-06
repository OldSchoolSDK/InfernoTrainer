
import StandardSpellbookTab from '../../assets/images/tabs/standard_spellbook.png'
import AncientsPanel from '../../assets/images/panels/ancients.png'
import { BaseControls } from './BaseControls'
import { BarrageMagicWeapon } from '../weapons/BarrageMagicWeapon'
import { Settings } from '../Settings'
import { World } from '../World'
import { ControlPanelController } from '../ControlPanelController'

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
    if (x >= 21 && x <= 42) {
      if (y >= 229 && y <= 249) {
        if (world.player.manualSpellCastSelection){
          world.player.manualSpellCastSelection = null;
        }else{
          world.player.manualSpellCastSelection = new BarrageMagicWeapon()
        }
      }
    }
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    world.viewportCtx.drawImage(this.panelImage, x, y)

    if (world.player.manualSpellCastSelection) {
      world.viewportCtx.fillStyle = '#D1BB7773'
      world.viewportCtx.fillRect(47, 225, 21, 21)
    }
  }
}
