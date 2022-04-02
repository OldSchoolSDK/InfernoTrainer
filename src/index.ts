'use strict'

import { InfernoRegion } from './content/inferno/js/InfernoRegion'
import { World as World } from './sdk/World'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { ImageLoader } from './sdk/utils/ImageLoader'
import NewRelicBrowser from 'new-relic-browser';
import { MapController } from './sdk/MapController'
import { Viewport } from './sdk/Viewport'
import { Player } from './sdk/Player'
import { BrowserUtils } from './sdk/utils/BrowserUtils'
import { InfernoLoadout } from './content/inferno/js/InfernoLoadout'
declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser
  }
}

Settings.readFromStorage()

const selectedRegion = new InfernoRegion();

// Create world
const world = new World();
selectedRegion.world = world;

// create player
const player = new Player(
  selectedRegion,
  { x: parseInt(BrowserUtils.getQueryVar('x')) || 25, y: parseInt(BrowserUtils.getQueryVar('y')) || 25 }
)
const loadoutType = selectedRegion.initializeAndGetLoadoutType();
const onTask = selectedRegion.initializeAndGetOnTask();
const loadout = new InfernoLoadout(selectedRegion.wave, loadoutType, onTask);

loadout.setStats(player); // flip this around one day
player.setUnitOptions(loadout.getLoadout());


Viewport.viewport.setPlayer(player);


world.getReadyTimer = 6;

selectedRegion.initialize()

ImageLoader.onAllImagesLoaded(() => {
  // Start the engine
  world.startTicking(selectedRegion, player)
})

const interval = setInterval(() => { 
  ImageLoader.checkImagesLoaded(interval);
}, 50);


/// /////////////////////////////////////////////////////////

window.newrelic.addRelease('inferno-trainer', process.env.COMMIT_REF)

