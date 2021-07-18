import { BaseControls } from './BaseControls'

import InventoryPanel from '../../assets/images/panels/inventory.png'
import SettingsTab from '../../assets/images/tabs/settings.png'

import MusicOnIcon from '../../assets/images/interface/button_music_on.png'
import MusicOffIcon from '../../assets/images/interface/button_music_off.png'

import ButtonRedUpIcon from '../../assets/images/interface/button_red_up.png'
import ButtonGreenDownIcon from '../../assets/images/interface/button_green_down.png'
import CompassIcon from '../../assets/images/interface/compass.png'
import ButtonActiveIcon from '../../assets/images/interface/button_active.png'
import ButtonInactiveIcon from '../../assets/images/interface/button_inactive.png'

import InfernoIcon from '../../assets/images/settings/inferno.png'
import VerzikIcon from '../../assets/images/settings/verzik.png'
import XarpusIcon from '../../assets/images/settings/xarpus.png'
import { Settings } from '../Settings'
import { BrowserUtils } from '../Utils/BrowserUtils'

export class SettingsControls extends BaseControls {
  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return SettingsTab
  }

  constructor () {
    super()
    this.musicOnImage = new Image()
    this.musicOnImage.src = MusicOnIcon
    this.musicOffImage = new Image()
    this.musicOffImage.src = MusicOffIcon
    this.redUpImage = new Image()
    this.redUpImage.src = ButtonRedUpIcon
    this.greenDownImage = new Image()
    this.greenDownImage.src = ButtonGreenDownIcon
    this.compassImage = new Image()
    this.compassImage.src = CompassIcon
    this.activeButtonImage = new Image()
    this.activeButtonImage.src = ButtonActiveIcon
    this.inactiveButtonImage = new Image()
    this.inactiveButtonImage.src = ButtonInactiveIcon
    this.infernoImage = new Image()
    this.infernoImage.src = InfernoIcon
    this.verzikImage = new Image()
    this.verzikImage.src = VerzikIcon
    this.xarpusImage = new Image()
    this.xarpusImage.src = XarpusIcon

    this.compassImage.addEventListener('load', () => {
      console.log('load', this)
      this.compassCanvas = new OffscreenCanvas(51, 51)

      const context = this.compassCanvas.getContext('2d')

      context.drawImage(this.compassImage, 0, 0)

      // only draw image where mask is
      context.globalCompositeOperation = 'destination-in'

      // draw our circle mask
      context.fillStyle = '#000'
      context.beginPath()
      const size = 38
      context.arc(
        (51 - size) * 0.5 + size * 0.5, // x
        (51 - size) * 0.5 + size * 0.5, // y
        size * 0.5, // radius
        0, // start angle
        2 * Math.PI // end angle
      )
      context.fill()

      // restore to default composite operation (is draw over current image)
      context.globalCompositeOperation = 'source-over'
    })
  }

  get keyBinding () {
    return BrowserUtils.getQueryVar('settings_key') || '5'
  }

  clickedPanel (region, x, y) {
    if (x > 20 && x < 56 && y > 20 && y < 56) {
      Settings.playsAudio = !Settings.playsAudio
    } else if (x > 90 && x < 105 && y > 20 && y < 36) {
      Settings.inputDelay += 20
    } else if (x > 90 && x < 105 && y > 51 && y < 67) {
      Settings.inputDelay -= 20
    } else if (x > 135 && x < 180 && y > 20 && y < 58) {
      if (Settings.rotated === 'south') {
        Settings.rotated = 'north'
      } else {
        Settings.rotated = 'south'
      }
    } else if (x > 20 && x < 60 && y > 100 && y < 140) {
      Settings.scenario = 'inferno'
    } else if (x > 80 && x < 120 && y > 100 && y < 140) {
      Settings.scenario = 'verzikp3'
    } else if (x > 140 && x < 180 && y > 100 && y < 140) {
      Settings.scenario = 'xarpusp2'
    }

    Settings.inputDelay = Math.max(0, Settings.inputDelay)
    Settings.persistToStorage()
  }

  draw (region, ctrl, x, y) {
    super.draw(region, ctrl, x, y)

    ctrl.ctx.drawImage(Settings.playsAudio ? this.musicOnImage : this.musicOffImage, x + 20, y + 20)

    ctrl.ctx.drawImage(this.redUpImage, x + 90, y + 20)
    ctrl.ctx.fillStyle = '#FFFF00'
    ctrl.ctx.font = '16px OSRS'
    ctrl.ctx.textAlign = 'center'
    ctrl.ctx.fillText(Settings.inputDelay, x + 96, y + 48)
    ctrl.ctx.drawImage(this.greenDownImage, x + 90, y + 51)
    ctrl.ctx.fillText('Lag', x + 97, y + 81)

    if (this.compassImage) {
      ctrl.ctx.save()
      ctrl.ctx.translate(x + 160, y + 35)
      if (Settings.rotated === 'south') {
        ctrl.ctx.rotate(Math.PI)
      }
      ctrl.ctx.translate(-x - 160, y - 35)
      ctrl.ctx.drawImage(this.compassCanvas, x + 135, y + 10)
      ctrl.ctx.restore()
      ctrl.ctx.fillText('Compass', x + 160, y + 71)
    }

    ctrl.ctx.drawImage(Settings.scenario === 'inferno' ? this.activeButtonImage : this.inactiveButtonImage, x + 20, y + 100)
    ctrl.ctx.drawImage(this.infernoImage, x + 22, y + 102, 36, 36)

    ctrl.ctx.drawImage(Settings.scenario === 'verzikp3' ? this.activeButtonImage : this.inactiveButtonImage, x + 80, y + 100)
    ctrl.ctx.drawImage(this.verzikImage, x + 82, y + 102, 36, 36)

    ctrl.ctx.drawImage(Settings.scenario === 'xarpusp2' ? this.activeButtonImage : this.inactiveButtonImage, x + 140, y + 100)
    ctrl.ctx.drawImage(this.xarpusImage, x + 142, y + 102, 36, 36)
    ctrl.ctx.fillText('Reload to change scenario', x + 100, y + 160)
  }
}
