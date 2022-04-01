'use strict'
import { AccountControls } from './controlpanels/AccountControls'
import { AncientsSpellbookControls } from './controlpanels/AncientsSpellbookControls'
import { BaseControls } from './controlpanels/BaseControls'
import { ClanChatControls } from './controlpanels/ClanChatControls'
import { CombatControls } from './controlpanels/CombatControls'
import { EmotesControls } from './controlpanels/EmotesControls'
import { EmptyControls } from './controlpanels/EmptyControls'
import { EquipmentControls } from './controlpanels/EquipmentControls'
import { FriendsControls } from './controlpanels/FriendsControls'
import { InventoryControls } from './controlpanels/InventoryControls'
import { MusicControls } from './controlpanels/MusicControls'
import { PrayerControls } from './controlpanels/PrayerControls'
import { QuestsControls } from './controlpanels/QuestsControls'
import { SettingsControls } from './controlpanels/SettingsControls'
import { StatsControls } from './controlpanels/StatsControls'
import { World } from './World'
import { Settings } from './Settings'
import { Location } from './Location'
import { Chrome } from './Chrome'

interface TabPosition{
  x: number;
  y: number;
}

export class ControlPanelController {
  static controls = Object.freeze({
    COMBAT: new CombatControls(),
    INVENTORY: new InventoryControls(),
    PRAYER: new PrayerControls(),
    EQUIPMENT: new EquipmentControls(),
    STATS: new StatsControls(),
    ANCIENTSSPELLBOOK: new AncientsSpellbookControls()
  });

  world?: World;
  desktopControls: BaseControls[];
  mobileControls: BaseControls[];
  controls: BaseControls[];
  selectedControl: BaseControls;
  
  width: number;
  height: number;

  constructor () {

    this.width = 33 * 7
    this.height = 36 * 2 + 275

    this.world = null


    this.desktopControls = [
      ControlPanelController.controls.COMBAT,
      ControlPanelController.controls.STATS,
      new QuestsControls(),
      ControlPanelController.controls.INVENTORY,
      ControlPanelController.controls.EQUIPMENT,
      ControlPanelController.controls.PRAYER,
      ControlPanelController.controls.ANCIENTSSPELLBOOK,
      new EmptyControls(),
      new FriendsControls(),
      new AccountControls(),
      new ClanChatControls(),
      new SettingsControls(),
      new EmotesControls(),
      new MusicControls()
    ]

    this.mobileControls = [
      ControlPanelController.controls.COMBAT,
      ControlPanelController.controls.PRAYER,
      ControlPanelController.controls.ANCIENTSSPELLBOOK,
      new EmotesControls(),
      new ClanChatControls(),
      new FriendsControls(),
      new AccountControls(),

      // break
      ControlPanelController.controls.INVENTORY,
      ControlPanelController.controls.EQUIPMENT,
      ControlPanelController.controls.STATS,
      new QuestsControls(),
      new MusicControls(),
      new SettingsControls(),
      new EmptyControls(),
    ]
    this.controls = Settings.mobileCheck() ? this.mobileControls : this.desktopControls;

    this.selectedControl = ControlPanelController.controls.PRAYER


    document.addEventListener('keydown', (event) => {
      if (Settings.is_keybinding){
        return;
      }
      
      this.controls.forEach((control) => {
        if (control.keyBinding === event.key) {
          this.selectedControl = control
          event.preventDefault();
        }
      })
    })
  }

  setWorld (world: World) {
    this.world = world
  }

  getTabScale() {
    let { width, height } = Chrome.size();


    const controlAreaHeight = height - this.world.mapController.height;
    let scaleRatio = controlAreaHeight / 7 / 36;

    let maxScaleRatio = 1.0;
    if (Settings.mobileCheck() && width > 600) {
      maxScaleRatio = 1.1;
    }
    
    if (scaleRatio > maxScaleRatio) {
      scaleRatio = maxScaleRatio;
    }

    Settings.controlPanelScale = scaleRatio * 0.915;

    return scaleRatio;
  }

   tabPosition (i: number, world: World): TabPosition {
    // let scale = Settings.controlPanelScale
    let { width, height } = Chrome.size();
    let scale = this.getTabScale();
    
    if (Settings.mobileCheck()) {
      const mapHeight = 170 * Settings.minimapScale;
      const spacer = (height - mapHeight - (36 * scale * 7)) / 2;
      if (i < 7) {
        return { x: 15, y: mapHeight + spacer + i * 36 * scale };
      }else{
        return { x: width - 33 * scale - 15, y: mapHeight + spacer + (i - 7) * 36 * scale };
      }
    }else{
      const x = i % 7
      const y = Math.floor(i / 7)
      return { 
        x: width - 231 * scale + x * 33 * scale, 
        y: height - 72 * scale + y * 36 * scale 
      }
    }
  }
  cursorMovedTo (e: MouseEvent) {
    let scale = Settings.controlPanelScale;
    if (this.selectedControl) {

    const x = e.offsetX;
    const y = e.offsetY;

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelPosition = this.controlPosition(this.selectedControl, this.world);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        this.selectedControl.cursorMovedto(this.world, relativeX, relativeY)
      }
    }


    }
  }
  controlPanelRightClick (e: MouseEvent): boolean {
    let intercepted = false;

    let scale = Settings.controlPanelScale;
    const x = e.offsetX;
    const y = e.offsetY;

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelPosition = this.controlPosition(this.selectedControl, this.world);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelRightClick(this.world, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  controlPanelClickUp (e: MouseEvent): boolean {


    let scale = Settings.controlPanelScale;
    if (!this.selectedControl) {
      return false;
    }
    
    let intercepted = false;

    const x = e.offsetX;
    const y = e.offsetY;
    
    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelPosition = this.controlPosition(this.selectedControl, this.world);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelClickUp(this.world, relativeX, relativeY)
      }
    }

    return intercepted;

  }

  controlPanelClickDown (e: MouseEvent): boolean {
    let intercepted = false;

    let scale = Settings.controlPanelScale;

    const x = e.offsetX;
    const y = e.offsetY;


    this.controls.forEach((control: BaseControls, index: number) => {
      const tabPosition = this.tabPosition(index, this.world)
      if (tabPosition.x <= x && x < tabPosition.x + 33 * scale) {
        if (tabPosition.y <= y && y < tabPosition.y + 36 * scale) {
          intercepted = true;
          if (this.controls[index] === this.selectedControl) {
            this.selectedControl = null
            return
          }
          this.selectedControl = this.controls[index]
        }
      }
    })


    if (!this.selectedControl) {
      return intercepted;
    }

    const panelWidth = 204 * scale
    const panelHeight = 275 * scale
    const panelPosition = this.controlPosition(this.selectedControl, this.world);
    const panelX = panelPosition.x;
    const panelY = panelPosition.y;
    if (panelX < x && x < panelX + panelWidth) {
      if (panelY < y && y < panelY + panelHeight) {
        const relativeX = x - panelX
        const relativeY = y - panelY
        intercepted = true;
        this.selectedControl.panelClickDown(this.world, relativeX, relativeY)
      }
    }

    return intercepted;
  }

  controlPosition(control: BaseControls, world: World): Location {
    
    let scale = this.getTabScale();
    let { width, height } = Chrome.size();

    if (Settings.mobileCheck()){
      const mapHeight = 170 * Settings.minimapScale;
      const spacer = (height - mapHeight - (36 * scale * 7)) / 2;
      if (this.selectedControl.appearsOnLeftInMobile) {
        // left side mobile
        return { x: 33 * scale + 15, y: mapHeight + spacer};
      }else{
        // right side mobile
        return { x: width - 33 * scale - 15 - 200 * Settings.controlPanelScale, y: mapHeight + spacer};
      }
    }else{
      // desktop compact
      return { 
        x: width - 188 * scale, 
        y: height - 72 * scale - 251 * scale
      };
    }
  }

  draw (world: World) {
    world.viewport.context.fillStyle = '#000'
    let scale = this.getTabScale();

    
    
    if (this.selectedControl && this.selectedControl.draw) {
      const position = this.controlPosition(this.selectedControl, world);
      this.selectedControl.draw(world, this, position.x, position.y);
    }

    let selectedPosition: TabPosition = null


    this.controls.forEach((control, index) => {
      const tabPosition = this.tabPosition(index, world)
      if (control.tabImage){
        world.viewport.context.drawImage(
          control.tabImage, 
          tabPosition.x, 
          tabPosition.y, 
          control.tabImage.width * scale, 
          control.tabImage.height * scale
          )
      }

      if (control.isAvailable === false){
        world.viewport.context.fillStyle = '#00000099'
        world.viewport.context.fillRect(tabPosition.x, tabPosition.y, 33 * scale, 36 * scale)
      }

      
      if (control === this.selectedControl) {
        selectedPosition = tabPosition
      }
    })

    if (selectedPosition) {
      world.viewport.context.strokeStyle = '#00FF0073'
      world.viewport.context.lineWidth = 3
      world.viewport.context.strokeRect(selectedPosition.x, selectedPosition.y, 33 * scale, 36 * scale)
    }



  }
}
