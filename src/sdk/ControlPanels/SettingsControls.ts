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

import InventoryTab from '../../assets/images/controlTabs/inventory.png'
import SpellbookTab from '../../assets/images/controlTabs/spellbook.png'
import PrayerTab from '../../assets/images/controlTabs/prayer.png'
import EquipmentTab from '../../assets/images/controlTabs/equipment.png'



import { Settings } from '../Settings'
import { BrowserUtils } from '../Utils/BrowserUtils'
import { Region } from '../Region'
import { ControlPanelController } from '../ControlPanelController'

export class SettingsControls extends BaseControls {
  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return SettingsTab
  }

  musicOnImage: HTMLImageElement;
  musicOffImage: HTMLImageElement;
  redUpImage: HTMLImageElement;
  greenDownImage: HTMLImageElement;
  compassImage: HTMLImageElement;
  activeButtonImage: HTMLImageElement
  inactiveButtonImage: HTMLImageElement;
  infernoImage: HTMLImageElement;
  verzikImage: HTMLImageElement;
  xarpusImage: HTMLImageElement;
  inventoryImage: HTMLImageElement;
  spellbookImage: HTMLImageElement;
  prayerImage: HTMLImageElement;
  equipmentImage: HTMLImageElement;
  bindingKey?: string;
  compassCanvas: OffscreenCanvas;

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
    this.inventoryImage = new Image()
    this.inventoryImage.src = InventoryTab
    this.spellbookImage = new Image()
    this.spellbookImage.src = SpellbookTab
    this.prayerImage = new Image()
    this.prayerImage.src = PrayerTab
    this.equipmentImage = new Image()
    this.equipmentImage.src = EquipmentTab


    this.bindingKey = null;


    document.addEventListener('keypress', (event) => {
      const key = event.key;
      if (this.bindingKey){

        if (this.bindingKey === 'inventory') {
          Settings.inventory_key = key
        }else if (this.bindingKey === 'spellbook'){
          Settings.spellbook_key = key
        }else if (this.bindingKey === 'prayer'){
          Settings.prayer_key = key
        }else if (this.bindingKey === 'equipment'){
          Settings.equipment_key = key
        }
        this.bindingKey = null;
        setTimeout(() => {
          Settings.is_keybinding = false
        }, 20)
        Settings.persistToStorage()

      }

    })


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

  clickedPanel (region: Region, x: number, y: number) {
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
    } else if (x > 20 && x < 60 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = 'inventory'
    } else if (x > 80 && x < 120 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = 'spellbook'
    } else if (x > 140 && x < 180 && y > 170 && y < 210) {
      Settings.is_keybinding = true;
      this.bindingKey = 'prayer'
    } else if (x > 20 && x < 60 && y > 220 && y < 260) {
      Settings.is_keybinding = true;
      this.bindingKey = 'equipment'
    }

    Settings.inputDelay = Math.max(0, Settings.inputDelay)
    Settings.persistToStorage()
  }

  draw (region: Region, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(region, ctrl, x, y)

    ctrl.ctx.drawImage(Settings.playsAudio ? this.musicOnImage : this.musicOffImage, x + 20, y + 20)

    ctrl.ctx.drawImage(this.redUpImage, x + 90, y + 20)
    ctrl.ctx.fillStyle = '#FFFF00'
    ctrl.ctx.font = '16px OSRS'
    ctrl.ctx.textAlign = 'center'
    ctrl.ctx.fillText(String(Settings.inputDelay), x + 96, y + 48)
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


    ctrl.ctx.drawImage(this.bindingKey === 'inventory' ? this.activeButtonImage : this.inactiveButtonImage, x + 22, y + 170)
    ctrl.ctx.drawImage(this.inventoryImage, x + 25, y + 172)
    ctrl.ctx.fillText(Settings.inventory_key, x + 25 + 30, y + 172 + 30)

    ctrl.ctx.drawImage(this.bindingKey === 'spellbook' ? this.activeButtonImage : this.inactiveButtonImage, x + 82, y + 170)
    ctrl.ctx.drawImage(this.spellbookImage, x + 85, y + 172)
    ctrl.ctx.fillText(Settings.spellbook_key, x + 85 + 30, y + 172 + 30)

    ctrl.ctx.drawImage(this.bindingKey === 'prayer' ? this.activeButtonImage : this.inactiveButtonImage, x + 142, y + 170)
    ctrl.ctx.drawImage(this.prayerImage, x + 145, y + 172)
    ctrl.ctx.fillText(Settings.prayer_key, x + 145 + 30, y + 172 + 30)

    ctrl.ctx.drawImage(this.bindingKey === 'equipment' ? this.activeButtonImage : this.inactiveButtonImage, x + 22, y + 220)
    ctrl.ctx.drawImage(this.equipmentImage, x + 25, y + 222)
    ctrl.ctx.fillText(Settings.equipment_key, x + 25 + 30, y + 222 + 30)
  
    if (this.bindingKey === null){
      ctrl.ctx.fillText('Key Bindings', x + 125, y + 212 + 30)
    }else{
      ctrl.ctx.fillText('Press Key To Bind', x + 135, y + 212 + 30)
    }
  }
}
