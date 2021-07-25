'use strict'

import { Inferno } from './content/inferno/Inferno'
import { VerzikP3 } from './content/verzik/VerzikP3'
import { Game } from './sdk/Game'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { InventoryControls } from './sdk/ControlPanels/InventoryControls'
import { Region } from './sdk/Region'
import { MapController } from './sdk/MapController'
import { ImageLoader } from './sdk/Utils/ImageLoader'

Settings.readFromStorage()
const selectedRegionName = Settings.region
let selectedRegion: Region;

console.log('selected region is ' + selectedRegionName)
switch (selectedRegionName) {
  case 'verzikp3':
    selectedRegion = new VerzikP3()
    break
  case 'inferno':
  default:
    selectedRegion = new Inferno()
}

// Create game
const game = new Game('game', selectedRegion);


const controlPanel = new ControlPanelController()
InventoryControls.inventory = selectedRegion.getInventory()

MapController.controller.setGame(game);

game.setMapController(MapController.controller)
game.setControlPanel(controlPanel)
controlPanel.setGame(game)

selectedRegion.initialize(game)

ImageLoader.onAllImagesLoaded(() => {
  // Start the engine
  game.startTicking()
})

const interval = setInterval(() => { 
  ImageLoader.checkImagesLoaded(interval);
}, 50);


/// /////////////////////////////////////////////////////////

document.getElementById('version').innerHTML = 'Version ' + process.env.COMMIT_REF || '' + ' - ' + process.env.BUILD_DATE || ''
