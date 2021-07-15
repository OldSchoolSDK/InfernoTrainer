'use strict';

import { Player } from '../../sdk/Player';
import { Region } from '../../sdk/Region';
import { Settings } from "../../sdk/Settings";
import { ControlPanelController } from "../../sdk/ControlPanelController";
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";
import { Verzik } from "./js/mobs/Verzik";
// Create region
const region = new Region("map", 29, 30);

const controlPanel = new ControlPanelController();

region.setControlPanel(controlPanel);
controlPanel.setRegion(region);


// Add player
const player = new Player({ x: parseInt(BrowserUtils.getQueryVar("x")) || 17, y: parseInt(BrowserUtils.getQueryVar("y")) || 3});
region.setPlayer(player);

// Add mobs
region.addMob(new Verzik({x: 16, y: 16}, player));

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

document.getElementById("playWaveNum").addEventListener("click", () => window.location = `/?wave=${document.getElementById("waveinput").value || wave}`);

document.getElementById("soundToggle").addEventListener("click", () => Settings.playsAudio = !Settings.playsAudio);

document.getElementById("version").innerHTML = "Version " + process.env.COMMIT_REF + " - " + process.env.BUILD_DATE;
