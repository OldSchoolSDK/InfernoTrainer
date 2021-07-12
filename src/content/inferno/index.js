'use strict';

import { Pillar } from "./js/Pillar";
import Player from '../../sdk/Player';
import Point from '../../sdk/Utils/Point';
import Stage from '../../sdk/Stage';
import { Waves } from "./js/Waves";
import Constants from "../../sdk/Constants";
import ControlPanelController from "../../sdk/ControlPanelController";
import { Mager } from "./js/mobs/Mager";
import { Ranger } from "./js/mobs/Ranger";
import { Meleer } from "./js/mobs/Meleer";
import { Blob } from "./js/mobs/Blob";
import { Bat } from "./js/mobs/Bat";
import BrowserUtils from "../../sdk/Utils/BrowserUtils";

// Create stage
const stage = new Stage("map", 29, 30);

const controlPanel = new ControlPanelController();

stage.setControlPanel(controlPanel);
controlPanel.setStage(stage);

// Add pillars
Pillar.addPillarsToStage(stage);


// Add player
const player = new Player(new Point(parseInt(BrowserUtils.getQueryVar("x")) || 17, parseInt(BrowserUtils.getQueryVar("y")) || 2));
stage.setPlayer(player);

// Add mobs

const bat = BrowserUtils.getQueryVar("bat")
const blob = BrowserUtils.getQueryVar("blob")
const melee = BrowserUtils.getQueryVar("melee")
const ranger = BrowserUtils.getQueryVar("ranger")
const mager = BrowserUtils.getQueryVar("mager")

if (bat || blob || melee || ranger || mager) {
  // Backwards compatibility layer for runelite plugin
  stage.wave = "imported";

  (JSON.parse(mager) || []).forEach((spawn) => stage.addMob(new Mager(new Point(spawn[0], spawn[1]))));
  (JSON.parse(ranger) || []).forEach((spawn) => stage.addMob(new Ranger(new Point(spawn[0], spawn[1]))));
  (JSON.parse(melee) || []).forEach((spawn) => stage.addMob(new Meleer(new Point(spawn[0], spawn[1]))));
  (JSON.parse(blob) || []).forEach((spawn) => stage.addMob(new Blob(new Point(spawn[0], spawn[1]))));
  (JSON.parse(bat) || []).forEach((spawn) => stage.addMob(new Bat(new Point(spawn[0], spawn[1]))));
  document.getElementById("replayLink").href = `/${window.location.search}`;

}else{

  // Native approach
  const wave = parseInt(BrowserUtils.getQueryVar("wave")) || 62;
  const spawns = BrowserUtils.getQueryVar("spawns") ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar("spawns"))) : Waves.getRandomSpawns();

  Waves.spawn(spawns, wave).forEach(stage.addMob.bind(stage));
  stage.wave = wave;

  const encodedSpawn = encodeURIComponent(JSON.stringify(spawns));
  document.getElementById("replayLink").href = `/?wave=${wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`;
  document.getElementById("waveinput").value = wave;
}

// Start the engine
stage.startTicking();

const timer = setInterval(() => {
  stage.heldDown--; // Release hold down clamps
  if (stage.heldDown <=0){
    clearInterval(timer);
  }
}, 600)

////////////////////////////////////////////////////////////
// UI controls

document.getElementById("playWaveNum").addEventListener("click", () => window.location = `/?wave=${document.getElementById("waveinput").value || wave}`);

document.getElementById("soundToggle").addEventListener("click", () => Constants.playsAudio = !Constants.playsAudio);

document.getElementById("version").innerHTML = "Version " + process.env.COMMIT_REF + " - " + process.env.BUILD_DATE;
