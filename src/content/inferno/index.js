'use strict';

import { Pillar } from "./js/Pillar";
import { Player } from '../../sdk/Player';
import { Region } from '../../sdk/Region';
import { Waves } from "./js/Waves";
import { Settings } from "../../sdk/Settings";
import { ControlPanelController } from "../../sdk/ControlPanelController";
import { Mager } from "./js/mobs/Mager";
import { Ranger } from "./js/mobs/Ranger";
import { Meleer } from "./js/mobs/Meleer";
import { Blob } from "./js/mobs/Blob";
import { Bat } from "./js/mobs/Bat";
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";

// Create region
const region = new Region("map", 29, 30);

const controlPanel = new ControlPanelController();

region.setControlPanel(controlPanel);
controlPanel.setRegion(region);

// Add pillars
Pillar.addPillarsToRegion(region);


// Add player
const player = new Player({ x: parseInt(BrowserUtils.getQueryVar("x")) || 17, y: parseInt(BrowserUtils.getQueryVar("y")) || 3});
region.setPlayer(player);

// Add mobs

const bat = BrowserUtils.getQueryVar("bat")
const blob = BrowserUtils.getQueryVar("blob")
const melee = BrowserUtils.getQueryVar("melee")
const ranger = BrowserUtils.getQueryVar("ranger")
const mager = BrowserUtils.getQueryVar("mager")

if (bat || blob || melee || ranger || mager) {
  // Backwards compatibility layer for runelite plugin
  region.wave = "imported";

  (JSON.parse(mager) || []).forEach((spawn) => region.addMob(new Mager({x: spawn[0], y: spawn[1]}, player)));
  (JSON.parse(ranger) || []).forEach((spawn) => region.addMob(new Ranger({x: spawn[0], y: spawn[1]}, player)));
  (JSON.parse(melee) || []).forEach((spawn) => region.addMob(new Meleer({x: spawn[0], y: spawn[1]}, player)));
  (JSON.parse(blob) || []).forEach((spawn) => region.addMob(new Blob({x: spawn[0], y: spawn[1]}, player)));
  (JSON.parse(bat) || []).forEach((spawn) => region.addMob(new Bat({x: spawn[0], y: spawn[1]}, player)));
  document.getElementById("replayLink").href = `/${window.location.search}`;

}else{

  // Native approach
  const wave = parseInt(BrowserUtils.getQueryVar("wave")) || 62;
  const spawns = BrowserUtils.getQueryVar("spawns") ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar("spawns"))) : Waves.getRandomSpawns();

  const randomPillar = _.shuffle(region.entities)[0];
  Waves.spawn(region, randomPillar, spawns, wave).forEach(region.addMob.bind(region));
  region.wave = wave;

  const encodedSpawn = encodeURIComponent(JSON.stringify(spawns));
  document.getElementById("replayLink").href = `/?wave=${wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`;
  document.getElementById("waveinput").value = wave;
}

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
