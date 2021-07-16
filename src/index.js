'use strict';

import { Inferno } from "./content/inferno/Inferno";
import { VerzikP3 } from "./content/verzik/VerzikP3";
import { XarpusP2 } from "./content/xarpus/XarpusP2";
import { Region } from './sdk/Region';
import { ControlPanelController } from './sdk/ControlPanelController';
import { BrowserUtils } from './sdk/Utils/BrowserUtils';
import { Settings } from './sdk/Settings';
import { InventoryControls } from "./sdk/ControlPanels/InventoryControls";

const selectedScenarioName = Settings.scenario;
let selectedScenario;
console.log("selected scenario is " + selectedScenarioName);
switch (selectedScenarioName) {
    case "verzikp3":
        selectedScenario = new VerzikP3();
        break;
    case "xarpusp2":
        selectedScenario = new XarpusP2();
        break;
    case "inferno":
    default:
        selectedScenario = new Inferno();
}

// Create region
const region = new Region("map",
  selectedScenario.getRegionWidth(),
  selectedScenario.getRegionHeight(),
  selectedScenario.getGridColor1(),
  selectedScenario.getGridColor2());

const controlPanel = new ControlPanelController(selectedScenario);
InventoryControls.inventory = selectedScenario.getInventory();

region.setControlPanel(controlPanel);
controlPanel.setRegion(region);

selectedScenario.initialize(region, document);

// Start the engine
region.startTicking();

const timer = setInterval(() => {
  region.heldDown--; // Release hold down clamps
  if (region.heldDown <=0){
    clearInterval(timer);
  }
}, 600)

////////////////////////////////////////////////////////////
// UI controls

document.getElementById("soundToggle").addEventListener("click", () => Settings.playsAudio = !Settings.playsAudio);

document.getElementById("version").innerHTML = "Version " + process.env.COMMIT_REF + " - " + process.env.BUILD_DATE;
