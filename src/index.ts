'use strict'

import { InfernoRegion } from './content/inferno/js/InfernoRegion'
import { VerzikP3 } from './content/verzik/VerzikP3'
import { World } from './sdk/World'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { InventoryControls } from './sdk/controlpanels/InventoryControls'
import { Region } from './sdk/Region'
import { MapController } from './sdk/MapController'
import { ImageLoader } from './sdk/utils/ImageLoader'
import NewRelicBrowser from 'new-relic-browser';

declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser
  }
}

Settings.readFromStorage()
const selectedRegionName = Settings.region
let selectedRegion: Region;

switch (selectedRegionName) {
  case 'verzikp3':
    selectedRegion = new VerzikP3()
    break
  case 'inferno':
  default:
    selectedRegion = new InfernoRegion()
}

// Create world


const controlPanel = new ControlPanelController()


const world = new World('world', selectedRegion, MapController.controller, controlPanel);

selectedRegion.initialize(world)

ImageLoader.onAllImagesLoaded(() => {
  // Start the engine
  world.startTicking()
})

const interval = setInterval(() => { 
  ImageLoader.checkImagesLoaded(interval);
}, 50);


/// /////////////////////////////////////////////////////////

document.getElementById('version').innerHTML = 'Version ' + process.env.COMMIT_REF + ' - ' + process.env.BUILD_DATE
window.newrelic.addRelease('inferno-trainer', process.env.COMMIT_REF)

