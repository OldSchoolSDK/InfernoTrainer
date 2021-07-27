
import StandardSpellbookTab from '../../assets/images/tabs/standard_spellbook.png'
import AncientsPanel from '../../assets/images/panels/ancients.png'
import { BaseControls } from './BaseControls'
import { BarrageMagicWeapon } from '../Weapons/BarrageMagicWeapon'
import { Settings } from '../Settings'
import { Game } from '../Game'
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

  clickedPanel (game: Game, x: number, y: number) {
    if (x >= 21 && x <= 42) {
      if (y >= 229 && y <= 249) {
        game.player.manualSpellCastSelection = new BarrageMagicWeapon()
      }
    }
  }

  draw (game: Game, ctrl: ControlPanelController, x: number, y: number) {
    game.ctx.drawImage(this.panelImage, x, y)

    if (game.player.manualSpellCastSelection) {
      game.ctx.fillStyle = '#D1BB7773'
      game.ctx.fillRect(47, 225, 21, 21)
    }
  }
}
