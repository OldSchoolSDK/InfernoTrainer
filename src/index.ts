'use strict'

import { Inferno } from './content/inferno/Inferno'
import { VerzikP3 } from './content/verzik/VerzikP3'
import { Region } from './sdk/Region'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { InventoryControls } from './sdk/ControlPanels/InventoryControls'
import { Scenario } from './sdk/Scenario'

Settings.readFromStorage()
const selectedScenarioName = Settings.scenario
let selectedScenario: Scenario;

console.log('selected scenario is ' + selectedScenarioName)
switch (selectedScenarioName) {
  case 'verzikp3':
    selectedScenario = new VerzikP3()
    break
  case 'inferno':
  default:
    selectedScenario = new Inferno()
}

// Create region
const region = new Region('map', selectedScenario.getRegionWidth(), selectedScenario.getRegionHeight())

const controlPanel = new ControlPanelController()
InventoryControls.inventory = selectedScenario.getInventory()

region.setControlPanel(controlPanel)
controlPanel.setRegion(region)

selectedScenario.initialize(region)

// Start the engine
region.startTicking()

const timer = setInterval(() => {
  region.heldDown-- // Release hold down clamps
  if (region.heldDown <= 0) {
    clearInterval(timer)
  }
}, 600)

/// /////////////////////////////////////////////////////////

document.getElementById('version').innerHTML = 'Version ' + process.env.COMMIT_REF || '' + ' - ' + process.env.BUILD_DATE || ''
