'use strict'

import { InfernoRegion } from './content/inferno/js/InfernoRegion'
import { World } from './sdk/World'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { Region } from './sdk/Region'
import { ImageLoader } from './sdk/utils/ImageLoader'
import NewRelicBrowser from 'new-relic-browser';

declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser
  }
}

// Random.setRandom('sin');

Settings.readFromStorage()
const selectedRegionName = Settings.region
let selectedRegion: Region;

switch (selectedRegionName) {
  case 'inferno':
  default:
    selectedRegion = new InfernoRegion()
}

// Create world



const world = new World(selectedRegion);

selectedRegion.initialize(world)

ImageLoader.onAllImagesLoaded(() => {
  // Start the engine
  world.startTicking()
})

const interval = setInterval(() => { 
  ImageLoader.checkImagesLoaded(interval);
}, 50);


/// /////////////////////////////////////////////////////////

window.newrelic.addRelease('inferno-trainer', process.env.COMMIT_REF)

