'use strict'

import { Inferno } from './content/inferno/Inferno'
import { VerzikP3 } from './content/verzik/VerzikP3'
import { Game } from './sdk/Game'
import { ControlPanelController } from './sdk/ControlPanelController'
import { Settings } from './sdk/Settings'
import { InventoryControls } from './sdk/ControlPanels/InventoryControls'
import { Region } from './sdk/Region'

Settings.readFromStorage()
const selectedScenarioName = Settings.scenario
let selectedScenario: Region;

console.log('selected scenario is ' + selectedScenarioName)
switch (selectedScenarioName) {
  case 'verzikp3':
    selectedScenario = new VerzikP3()
    break
  case 'inferno':
  default:
    selectedScenario = new Inferno()
}

// Create game
const game = new Game(
  'map',
  selectedScenario
  )

const controlPanel = new ControlPanelController()
InventoryControls.inventory = selectedScenario.getInventory()

game.setControlPanel(controlPanel)
controlPanel.setGame(game)

selectedScenario.initialize(game)

// Start the engine
game.startTicking()

const timer = setInterval(() => {
  game.heldDown-- // Release hold down clamps
  if (game.heldDown <= 0) {
    clearInterval(timer)
  }
}, 600)

/// /////////////////////////////////////////////////////////

document.getElementById('version').innerHTML = 'Version ' + process.env.COMMIT_REF || '' + ' - ' + process.env.BUILD_DATE || ''
