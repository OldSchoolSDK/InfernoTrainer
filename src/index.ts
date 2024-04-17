"use strict";

import { InfernoRegion } from "./content/inferno/js/InfernoRegion";
import { World as World } from "./sdk/World";
import { Settings } from "./sdk/Settings";
import { ImageLoader } from "./sdk/utils/ImageLoader";
import NewRelicBrowser from "new-relic-browser";
import { Viewport } from "./sdk/Viewport";
import { Player } from "./sdk/Player";
import { BrowserUtils } from "./sdk/utils/BrowserUtils";
import { InfernoLoadout } from "./content/inferno/js/InfernoLoadout";
import { shuffle, filter } from "lodash";
import { InfernoPillar } from "./content/inferno/js/InfernoPillar";
import { InfernoWaves } from "./content/inferno/js/InfernoWaves";
import { JalAk } from "./content/inferno/js/mobs/JalAk";
import { JalImKot } from "./content/inferno/js/mobs/JalImKot";
import { JalMejRah } from "./content/inferno/js/mobs/JalMejRah";
import { JalTokJad } from "./content/inferno/js/mobs/JalTokJad";
import { JalXil } from "./content/inferno/js/mobs/JalXil";
import { JalZek } from "./content/inferno/js/mobs/JalZek";
import { TzKalZuk } from "./content/inferno/js/mobs/TzKalZuk";
import { ZukShield } from "./content/inferno/js/ZukShield";
import { InvisibleMovementBlocker } from "./content/MovementBlocker";
import { TileMarker } from "./content/TileMarker";
import { Wall } from "./content/Wall";
import { EntityName } from "./sdk/EntityName";
import { Mob } from "./sdk/Mob";
import { Location } from "./sdk/Location";
import { MapController } from "./sdk/MapController";
import { Assets } from "./sdk/utils/Assets";
import { Chrome } from "./sdk/Chrome";

import SpecialAttackBarBackground from "./assets/images/attackstyles/interface/special_attack_background.png";
import { InfernoScene } from "./content/InfernoScene";
import { TwistedBow } from "./content/weapons/TwistedBow";

declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser;
  }
}

Settings.readFromStorage();

const selectedRegion = new InfernoRegion();

// Create world
const world = new World();
world.getReadyTimer = 6;
selectedRegion.world = world;
world.addRegion(selectedRegion);

// create player
const player = new Player(selectedRegion, {
  x: parseInt(BrowserUtils.getQueryVar("x")) || 25,
  y: parseInt(BrowserUtils.getQueryVar("y")) || 25,
});

selectedRegion.addPlayer(player);

// const player2 = new Player(
//   selectedRegion,
//   { x: 30, y: 40 }
// )
// player2.autoRetaliate = true;
// new Blowpipe().inventoryLeftClick(player2);
// new NecklaceOfAnguish().inventoryLeftClick(player2);
// new PegasianBoots().inventoryLeftClick(player2);
// selectedRegion.addPlayer(player2);

const loadoutType = selectedRegion.initializeAndGetLoadoutType();
const onTask = selectedRegion.initializeAndGetOnTask();
const southPillar = selectedRegion.initializeAndGetSouthPillar();
const westPillar = selectedRegion.initializeAndGetWestPillar();
const northPillar = selectedRegion.initializeAndGetNorthPillar();

selectedRegion.initializeAndGetUse3dView();
selectedRegion.wave = parseInt(BrowserUtils.getQueryVar("wave"));

if (isNaN(selectedRegion.wave)) {
  selectedRegion.wave = 62;
}
if (selectedRegion.wave < 0) {
  selectedRegion.wave = 0;
}
if (selectedRegion.wave > InfernoWaves.waves.length + 8) {
  selectedRegion.wave = InfernoWaves.waves.length + 8;
}

const loadout = new InfernoLoadout(selectedRegion.wave, loadoutType, onTask);

loadout.setStats(player); // flip this around one day
player.setUnitOptions(loadout.getLoadout());

Viewport.setupViewport(selectedRegion);
Viewport.viewport.setPlayer(player);

ImageLoader.onAllImagesLoaded(() => {
  MapController.controller.updateOrbsMask(player.currentStats, player.stats);
});
if (selectedRegion.wave < 67 || selectedRegion.wave >= 70) {
  // Add pillars
  InfernoPillar.addPillarsToWorld(selectedRegion, southPillar, westPillar, northPillar);
}

const randomPillar = (shuffle(
  selectedRegion.entities.filter((entity) => entity.entityName() === EntityName.PILLAR),
) || [null])[0]; // Since we've only added pillars this is safe. Do not move to after movement blockers.

for (let x = 10; x < 41; x++) {
  selectedRegion.addEntity(new InvisibleMovementBlocker(this, { x, y: 13 }));
  selectedRegion.addEntity(new InvisibleMovementBlocker(this, { x, y: 44 }));
}
for (let y = 14; y < 44; y++) {
  selectedRegion.addEntity(new InvisibleMovementBlocker(this, { x: 10, y }));
  selectedRegion.addEntity(new InvisibleMovementBlocker(this, { x: 40, y }));
}
const waveInput: HTMLInputElement = document.getElementById("waveinput") as HTMLInputElement;

const exportWaveInput: HTMLButtonElement = document.getElementById("exportCustomWave") as HTMLButtonElement;
const editWaveInput: HTMLButtonElement = document.getElementById("editWave") as HTMLButtonElement;

editWaveInput.addEventListener("click", () => {
  const magers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_ZEK;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const rangers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_XIL;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const meleers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_IM_KOT;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const blobs = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_AK;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const bats = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_MEJ_RAJ;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const url = `/?wave=0&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(
    rangers,
  )}&melee=${JSON.stringify(meleers)}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`;
  window.location.href = url;
});
exportWaveInput.addEventListener("click", () => {
  const magers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_ZEK;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const rangers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_XIL;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const meleers = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_IM_KOT;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const blobs = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_AK;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const bats = filter(selectedRegion.mobs, (mob: Mob) => {
    return mob.mobName() === EntityName.JAL_MEJ_RAJ;
  }).map((mob: Mob) => {
    return [mob.location.x - 11, mob.location.y - 14];
  });

  const url = `/?wave=74&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(rangers)}&melee=${JSON.stringify(
    meleers,
  )}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`;
  window.location.href = url;
});

const bat = BrowserUtils.getQueryVar("bat") || "[]";
const blob = BrowserUtils.getQueryVar("blob") || "[]";
const melee = BrowserUtils.getQueryVar("melee") || "[]";
const ranger = BrowserUtils.getQueryVar("ranger") || "[]";
const mager = BrowserUtils.getQueryVar("mager") || "[]";
const replayLink = document.getElementById("replayLink") as HTMLLinkElement;

function importSpawn() {
  try {
    JSON.parse(mager).forEach((spawn: number[]) =>
      selectedRegion.addMob(new JalZek(selectedRegion, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
    );
    JSON.parse(ranger).forEach((spawn: number[]) =>
      selectedRegion.addMob(new JalXil(selectedRegion, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
    );
    JSON.parse(melee).forEach((spawn: number[]) =>
      selectedRegion.addMob(new JalImKot(selectedRegion, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
    );
    JSON.parse(blob).forEach((spawn: number[]) =>
      selectedRegion.addMob(new JalAk(selectedRegion, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
    );
    JSON.parse(bat).forEach((spawn: number[]) =>
      selectedRegion.addMob(new JalMejRah(selectedRegion, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
    );

    InfernoWaves.spawnNibblers(3, selectedRegion, randomPillar).forEach(selectedRegion.addMob.bind(selectedRegion));

    replayLink.href = `/${window.location.search}`;
  } catch (ex) {
    console.log("failed to import wave from inferno stats");
  }
}

if (Settings.tile_markers) {
  Settings.tile_markers
    .map((location: Location) => {
      return new TileMarker(selectedRegion, location, "#FF0000");
    })
    .forEach((tileMarker: TileMarker) => {
      selectedRegion.addEntity(tileMarker);
    });
}

// Add 3d scene
if (Settings.use3dView) {
  selectedRegion.addEntity(new InfernoScene(selectedRegion, { x: 0, y: 48 }));
}

// Add mobs
if (selectedRegion.wave === 0) {
  // world.getReadyTimer = 0;
  player.location = { x: 28, y: 17 };
  world.getReadyTimer = -1;

  InfernoWaves.getRandomSpawns().forEach((spawn: Location) => {
    [2, 3, 4].forEach((size: number) => {
      const tileMarker = new TileMarker(selectedRegion, spawn, "#FF730073", size, false);
      selectedRegion.addEntity(tileMarker);
    });
  });

  importSpawn();
} else if (selectedRegion.wave < 67) {
  player.location = { x: 28, y: 17 };

  // this.addMob(new JalMejRah(world, {x: 0, y: 0}, { aggro: player}))

  if (bat != "[]" || blob != "[]" || melee != "[]" || ranger != "[]" || mager != "[]") {
    // Backwards compatibility layer for runelite plugin
    selectedRegion.wave = 1;

    importSpawn();
  } else {
    // Native approach
    const spawns = BrowserUtils.getQueryVar("spawns")
      ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar("spawns")))
      : InfernoWaves.getRandomSpawns();

    InfernoWaves.spawn(selectedRegion, player, randomPillar, spawns, selectedRegion.wave).forEach(
      selectedRegion.addMob.bind(selectedRegion),
    );

    const encodedSpawn = encodeURIComponent(JSON.stringify(spawns));
    replayLink.href = `/?wave=${selectedRegion.wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`;
    waveInput.value = String(selectedRegion.wave);
  }
} else if (selectedRegion.wave === 67) {
  player.location = { x: 18, y: 25 };
  const jad = new JalTokJad(
    selectedRegion,
    { x: 23, y: 27 },
    { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false },
  );
  selectedRegion.addMob(jad);
} else if (selectedRegion.wave === 68) {
  player.location = { x: 25, y: 27 };

  const jad1 = new JalTokJad(
    selectedRegion,
    { x: 18, y: 24 },
    { aggro: player, attackSpeed: 9, stun: 1, healers: 3, isZukWave: false },
  );
  selectedRegion.addMob(jad1);

  const jad2 = new JalTokJad(
    selectedRegion,
    { x: 28, y: 24 },
    { aggro: player, attackSpeed: 9, stun: 7, healers: 3, isZukWave: false },
  );
  selectedRegion.addMob(jad2);

  const jad3 = new JalTokJad(
    selectedRegion,
    { x: 23, y: 35 },
    { aggro: player, attackSpeed: 9, stun: 4, healers: 3, isZukWave: false },
  );
  selectedRegion.addMob(jad3);
} else if (selectedRegion.wave === 69) {
  player.location = { x: 25, y: 15 };

  // spawn zuk
  const shield = new ZukShield(selectedRegion, { x: 23, y: 13 }, { aggro: player });
  selectedRegion.addMob(shield);

  selectedRegion.addMob(new TzKalZuk(selectedRegion, { x: 22, y: 8 }, { aggro: player }));

  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 8 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 7 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 6 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 5 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 4 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 3 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 2 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 1 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 21, y: 0 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 8 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 7 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 6 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 5 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 4 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 3 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 2 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 1 }));
  selectedRegion.addEntity(new Wall(selectedRegion, { x: 29, y: 0 }));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 14, y: 14 }, "#00FF00", 1, false));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 16, y: 14 }, "#FF0000", 1, false));
  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 17, y: 14 }, "#FF0000", 1, false));
  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 18, y: 14 }, "#FF0000", 1, false));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 20, y: 14 }, "#00FF00", 1, false));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 30, y: 14 }, "#00FF00", 1, false));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 32, y: 14 }, "#FF0000", 1, false));
  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 33, y: 14 }, "#FF0000", 1, false));
  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 34, y: 14 }, "#FF0000", 1, false));

  selectedRegion.addEntity(new TileMarker(selectedRegion, { x: 36, y: 14 }, "#00FF00", 1, false));
} else if (selectedRegion.wave === 74) {
  player.location = { x: 28, y: 17 };

  importSpawn();
}
player.perceivedLocation = player.location;
player.destinationLocation = player.location;
/// /////////////////////////////////////////////////////////
// UI controls

document.getElementById("playWaveNum").addEventListener("click", () => {
  window.location.href = `/?wave=${waveInput.value || selectedRegion.wave}`;
});

document
  .getElementById("pauseResumeLink")
  .addEventListener("click", () => (world.isPaused ? world.startTicking() : world.stopTicking()));

ImageLoader.onAllImagesLoaded(() =>
  MapController.controller.updateOrbsMask(Viewport.viewport.player.currentStats, Viewport.viewport.player.stats),
);

ImageLoader.onAllImagesLoaded(() => {
  drawAssetLoadingBar(loadingAssetProgress);
  imagesReady = true;
  checkStart();
});

const interval = setInterval(() => {
  ImageLoader.checkImagesLoaded(interval);
}, 50);

Assets.onAllAssetsLoaded(() => {
  // renders a single frame
  Viewport.viewport.initialise().then(() => {
    console.log("assets are preloaded");
    assetsPreloaded = true;
    checkStart();
  });
});

function drawAssetLoadingBar(loadingProgress: number) {
  const specialAttackBarBackground = ImageLoader.createImage(SpecialAttackBarBackground);
  const { width: canvasWidth, height: canvasHeight } = Chrome.size();
  const canvas = document.getElementById("world") as HTMLCanvasElement;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#FFFF00";
  context.font = "32px OSRS";
  context.textAlign = "center";
  context.fillText(`Loading models: ${Math.floor(loadingProgress * 100)}%`, canvas.width / 2, canvas.height / 2);
  const scale = 2;
  const left = canvasWidth / 2 - (specialAttackBarBackground.width * scale) / 2;
  const top = canvasHeight / 2 + 20;
  const width = specialAttackBarBackground.width * scale;
  const height = specialAttackBarBackground.height * scale;
  context.drawImage(specialAttackBarBackground, left, top, width, height);
  context.fillStyle = "#730606";
  context.fillRect(left + 2 * scale, top + 6 * scale, width - 4 * scale, height - 12 * scale);
  context.fillStyle = "#397d3b";
  context.fillRect(left + 2 * scale, top + 6 * scale, (width - 4 * scale) * loadingProgress, height - 12 * scale);
  context.fillStyle = "#000000";
  context.globalAlpha = 0.5;
  context.strokeRect(left + 2 * scale, top + 6 * scale, width - 4 * scale, height - 12 * scale);
  context.globalAlpha = 1;
}

let loadingAssetProgress = 0.0;
drawAssetLoadingBar(loadingAssetProgress);

Assets.onAssetProgress((loaded, total) => {
  loadingAssetProgress = loaded / total;
  drawAssetLoadingBar(loadingAssetProgress);
});

const assets2 = setInterval(() => {
  Assets.checkAssetsLoaded(assets2);
}, 50);

let imagesReady = false;
let assetsPreloaded = false;
let started = false;

function checkStart() {
  if (!started && imagesReady && assetsPreloaded) {
    started = true;
    // Start the engine
    world.startTicking();
  }
}

/// /////////////////////////////////////////////////////////

window.newrelic.addRelease("inferno-trainer", process.env.COMMIT_REF);

// UI disclaimer
const topHeaderContainer = document.getElementById("disclaimer_panel");
if (!process.env.DEPLOY_URL?.includes("infernotrainer.com")) {
  topHeaderContainer.innerHTML = "PREVIEW BUILD for 3D mode. Visit <a href=\"https://www.infernotrainer.com\">infernotrainer.com</a> for the original.<br />" + topHeaderContainer.innerHTML
}