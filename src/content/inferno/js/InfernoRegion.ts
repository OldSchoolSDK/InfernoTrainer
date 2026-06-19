"use strict";
import { BrowserUtils, ItemName, CardinalDirection, ControlPanelController, Entity, EntityNames, ImageLoader, InvisibleMovementBlocker, Location, Mob, Player, Region, Settings, TileMarker, Trainer, Viewport } from "osrs-sdk";

import InfernoMapImage from "../assets/images/map.png";

import { filter, shuffle } from "lodash";
import { InfernoLoadout } from "./InfernoLoadout";
import { InfernoMobDeathStore } from "./InfernoMobDeathStore";
import { InfernoPillar } from "./InfernoPillar";
import { InfernoScene } from "./InfernoScene";
import { InfernoSettings } from "./InfernoSettings";
import { InfernoWaves } from "./InfernoWaves";
import { JalAk } from "./mobs/JalAk";
import { JalImKot } from "./mobs/JalImKot";
import { JalMejRah } from "./mobs/JalMejRah";
import { JalTokJad } from "./mobs/JalTokJad";
import { JalXil } from "./mobs/JalXil";
import { JalZek } from "./mobs/JalZek";
import { TzKalZuk } from "./mobs/TzKalZuk";
import { Wall } from "./Wall";
import { ZukShield, type ShieldDirection } from "./ZukShield";

import SidebarContent from "../sidebar.html";
import { AttackCooldownOverlay } from "./AttackCooldownOverlay";

/* eslint-disable @typescript-eslint/no-explicit-any */



export class InfernoRegion extends Region {
  wave: number;
  fourTickCycleIndex: number = 0;
  fourTickBoxes: HTMLDivElement[] = [];
  fourTickContainer: HTMLDivElement | null = null;
  fourTickCycleEnabled: boolean = true;
  fourTickSettingsToggle: HTMLDivElement | null = null;
  private attackCooldownOverlay?: AttackCooldownOverlay;
  mapImage: HTMLImageElement = ImageLoader.createImage(InfernoMapImage);

  // Wave progression properties
  private waveCompleteTimer = -1; // -1 = not triggered, 0-7 = countdown to next wave
  private lastMobCount = 0;
  private waveProgressionEnabled = false;

  // Spawn indicator entities
  private spawnIndicators: Entity[] = [];

  get initialFacing() {
    return this.wave === 69 ? CardinalDirection.NORTH : CardinalDirection.SOUTH;
  }

  getName() {
    return "Inferno";
  }

  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }

  rightClickActions(): any[] {
    if (this.wave !== 0) {
      return [];
    }

    return [
      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: "Bat", fillStyle: "blue" },
        ],
        action: () => {
          Trainer.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalMejRah(this, { x, y }, { aggro: Trainer.player });
          mob.removableWithRightClick = true;
          this.addMob(mob);
        },
      },

      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: "Blob", fillStyle: "green" },
        ],
        action: () => {
          Trainer.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalAk(this, { x, y }, { aggro: Trainer.player });
          mob.removableWithRightClick = true;
          this.addMob(mob);
        },
      },

      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: "Meleer", fillStyle: "yellow" },
        ],
        action: () => {
          Trainer.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalImKot(this, { x, y }, { aggro: Trainer.player });
          mob.removableWithRightClick = true;
          this.addMob(mob);
        },
      },

      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: "Ranger", fillStyle: "orange" },
        ],
        action: () => {
          Trainer.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalXil(this, { x, y }, { aggro: Trainer.player });
          mob.removableWithRightClick = true;
          this.addMob(mob);
        },
      },

      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: "Mager", fillStyle: "red" },
        ],
        action: () => {
          Trainer.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalZek(this, { x, y }, { aggro: Trainer.player });
          mob.removableWithRightClick = true;
          this.addMob(mob);
        },
      },
    ];
  }

  initializeAndGetLoadoutType() {
    const loadoutSelector = document.getElementById("loadouts") as HTMLInputElement;
    loadoutSelector.value = Settings.loadout;
    loadoutSelector.addEventListener("change", () => {
      Settings.loadout = loadoutSelector.value;
      Settings.persistToStorage();
    });

    return loadoutSelector.value;
  }

  initializeAndGetOnTask() {
    const onTaskCheckbox = document.getElementById("onTask") as HTMLInputElement;
    onTaskCheckbox.checked = Settings.onTask;
    onTaskCheckbox.addEventListener("change", () => {
      Settings.onTask = onTaskCheckbox.checked;
      Settings.persistToStorage();
    });
    return onTaskCheckbox.checked;
  }

  initializeAndGetSouthPillar() {
    const southPillarCheckbox = document.getElementById("southPillar") as HTMLInputElement;
    southPillarCheckbox.checked = Settings.southPillar;
    southPillarCheckbox.addEventListener("change", () => {
      Settings.southPillar = southPillarCheckbox.checked;
      Settings.persistToStorage();
    });
    return southPillarCheckbox.checked;
  }

  initializeAndGetWestPillar() {
    const westPillarCheckbox = document.getElementById("westPillar") as HTMLInputElement;
    westPillarCheckbox.checked = Settings.westPillar;
    westPillarCheckbox.addEventListener("change", () => {
      Settings.westPillar = westPillarCheckbox.checked;
      Settings.persistToStorage();
    });
    return westPillarCheckbox.checked;
  }

  initializeAndGetNorthPillar() {
    const northPillarCheckbox = document.getElementById("northPillar") as HTMLInputElement;
    northPillarCheckbox.checked = Settings.northPillar;
    northPillarCheckbox.addEventListener("change", () => {
      Settings.northPillar = northPillarCheckbox.checked;
      Settings.persistToStorage();
    });
    return northPillarCheckbox.checked;
  }

  initializeAndGetShieldDirection(): ShieldDirection {
    const directionSelect = document.getElementById("shieldDirection") as HTMLInputElement;
    directionSelect.value = InfernoSettings.shieldDirection;
    directionSelect.addEventListener("change", () => {
      InfernoSettings.shieldDirection = directionSelect.value as ShieldDirection;
      InfernoSettings.persistToStorage();
      window.location.reload();
    });
    return directionSelect.value as ShieldDirection;
  }

  initializeAndGetUse3dView() {
    const use3dViewCheckbox = document.getElementById("use3dView") as HTMLInputElement;
    use3dViewCheckbox.checked = Settings.use3dView;
    use3dViewCheckbox.addEventListener("change", () => {
      Settings.use3dView = use3dViewCheckbox.checked;
      Settings.persistToStorage();
      window.location.reload();
    });
    return use3dViewCheckbox.checked;
  }

  initializeWaveProgressionToggle() {
    const waveProgressionCheckbox = document.getElementById("waveProgression") as HTMLInputElement;
    waveProgressionCheckbox.checked = InfernoSettings.waveProgression === true;
    waveProgressionCheckbox.addEventListener("change", () => {
      InfernoSettings.waveProgression = waveProgressionCheckbox.checked;
      InfernoSettings.persistToStorage();
    });
  }

  initializeSpawnIndicatorsToggle() {
    const spawnIndicatorsCheckbox = document.getElementById("spawnIndicators") as HTMLInputElement;
    spawnIndicatorsCheckbox.checked = InfernoSettings.spawnIndicators === true;
    spawnIndicatorsCheckbox.addEventListener("change", () => {
      InfernoSettings.spawnIndicators = spawnIndicatorsCheckbox.checked;
      InfernoSettings.persistToStorage();
      // Update current spawn indicators visibility
      if (!InfernoSettings.spawnIndicators) {
        this.clearSpawnIndicators();
      } else {
        // Refresh spawn indicators if enabled
        const spawns = InfernoWaves.getRandomSpawns();
        this.updateSpawnIndicators(spawns);
      }
    });
  }

  isSettingsTabOpen() {
  const selectedControl = ControlPanelController.controller.selectedControl as any;
  const controls = ControlPanelController.controls as any;

  const possibleSettingsControls = [
    controls.SETTINGS,
    controls.OPTIONS,
    controls.SETTING,
    controls.CONFIG,
  ].filter(Boolean);

  const selectedControlText = [
    selectedControl?.constructor?.name,
    selectedControl?.name,
    selectedControl?.label,
    selectedControl?.id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    possibleSettingsControls.includes(selectedControl) ||
    selectedControlText.includes("setting") ||
    selectedControlText.includes("option")
  );
}

  initializeDisplaySetTimerToggle() {
    const displaySetTimerCheckbox = document.getElementById("displaySetTimer") as HTMLInputElement;
    displaySetTimerCheckbox.checked = InfernoSettings.displaySetTimer === true;
    displaySetTimerCheckbox.addEventListener("change", () => {
      InfernoSettings.displaySetTimer = displaySetTimerCheckbox.checked;
      InfernoSettings.persistToStorage();
    });
  }

  initializeFourTickCycle() {
  // Remove old overlay if it somehow already exists
  if (this.fourTickContainer) {
    this.fourTickContainer.remove();
    this.fourTickContainer = null;
  }
  if (this.fourTickSettingsToggle) {
  this.fourTickSettingsToggle.remove();
  this.fourTickSettingsToggle = null;
}

const savedFourTickSetting = localStorage.getItem(
  "inferno_four_tick_cycle_enabled",
);

this.fourTickCycleEnabled =
  savedFourTickSetting === null ? true : savedFourTickSetting === "true";

  const container = document.createElement("div");
  container.id = "floatingFourTickCycle";
  container.style.position = "fixed";
  container.style.right = "320px";
  container.style.bottom = "400px";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.gap = "6px";
  container.style.padding = "6px";
  container.style.pointerEvents = "none";

  const boxes: HTMLDivElement[] = [];

  for (let i = 0; i < 4; i++) {
    const box = document.createElement("div");
    box.innerText = String(i + 1);
    box.style.width = "38px";
    box.style.height = "38px";
    box.style.lineHeight = "38px";
    box.style.textAlign = "center";
    box.style.fontWeight = "bold";
    box.style.fontSize = "20px";
    box.style.border = "2px solid #4a90e2";
    box.style.borderRadius = "4px";
    box.style.background = "#1e2b3a";
    box.style.color = "white";
    box.style.boxSizing = "border-box";
    box.style.fontFamily = "sans-serif";

    boxes.push(box);
    container.appendChild(box);
  }

  document.body.appendChild(container);

  this.fourTickContainer = container;
  this.fourTickBoxes = boxes;

  const settingsToggle = document.createElement("div");
settingsToggle.id = "fourTickSettingsToggle";
settingsToggle.style.position = "fixed";
settingsToggle.style.right = "345px";
settingsToggle.style.bottom = "405px";
settingsToggle.style.zIndex = "10000";
settingsToggle.style.display = "none";
settingsToggle.style.alignItems = "center";
settingsToggle.style.gap = "6px";
settingsToggle.style.color = "yellow";
settingsToggle.style.fontWeight = "";
settingsToggle.style.fontSize = "24px";
settingsToggle.style.pointerEvents = "auto";
settingsToggle.style.userSelect = "none";

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = this.fourTickCycleEnabled;
checkbox.style.cursor = "pointer";

const label = document.createElement("span");
label.innerText = "4-Tick Prayer Visual";

checkbox.addEventListener("change", () => {
  this.fourTickCycleEnabled = checkbox.checked;

  localStorage.setItem(
    "inferno_four_tick_cycle_enabled",
    String(this.fourTickCycleEnabled),
  );

  this.updateFourTickCycleDisplay();
});

settingsToggle.addEventListener("mousedown", (event) => {
  event.stopPropagation();
});

settingsToggle.addEventListener("click", (event) => {
  event.stopPropagation();
});

settingsToggle.appendChild(checkbox);
settingsToggle.appendChild(label);

document.body.appendChild(settingsToggle);

this.fourTickSettingsToggle = settingsToggle;

  this.updateFourTickCycleDisplay();
}

updateFourTickCycleDisplay() {
  const isPrayerTabOpen =
    ControlPanelController.controller.selectedControl ===
    ControlPanelController.controls.PRAYER;

  const isSettingsTabOpen = this.isSettingsTabOpen();

  if (this.fourTickSettingsToggle) {
    this.fourTickSettingsToggle.style.display = isSettingsTabOpen
      ? "flex"
      : "none";
  }

  const shouldShowPrayerVisual =
    this.fourTickCycleEnabled && isPrayerTabOpen;

  if (this.fourTickContainer) {
    this.fourTickContainer.style.display = shouldShowPrayerVisual
      ? "flex"
      : "none";
  }

  if (!shouldShowPrayerVisual) {
    return;
  }

  this.fourTickBoxes.forEach((box, index) => {
    if (index === this.fourTickCycleIndex) {
      if (index === 0) {
        box.style.background = "#7dff7d";
        box.style.color = "black";
        box.style.borderColor = "#ffffff";
      } else {
        box.style.background = "#58c4ff";
        box.style.color = "black";
        box.style.borderColor = "#ffffff";
      }
    } else {
      box.style.background = "#1e2b3a";
      box.style.color = "white";
      box.style.borderColor = "#4a90e2";
    }
  });
}
  
initializeInfernoScouterCodeImport() {
  const input = document.getElementById(
    "infernoScouterCode",
  ) as HTMLInputElement;

  const button = document.getElementById(
    "loadInfernoScouterCode",
  ) as HTMLButtonElement;

  const message = document.getElementById(
    "infernoScouterCodeMessage",
  ) as HTMLElement;

  if (!input || !button) {
    return;
  }

  const trainerSpawnSlots = [
    [1, 5],   // slot 1
    [22, 5],  // slot 2
    [3, 11],  // slot 3
    [23, 12], // slot 4
    [16, 17], // slot 5
    [5, 23],  // slot 6
    [23, 25], // slot 7
    [1, 28],  // slot 8
    [15, 28], // slot 9
  ];

  const parseCode = (rawCode: string) => {
    let code = rawCode.trim();

    // If the user pasted "[oMRoBXoYo]", use the part inside brackets.
    const bracketMatch = code.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
      code = bracketMatch[1];
    }

    // Remove spaces, brackets, and NPC-index rank numbers.
    // Example: "M1oR2ooooo" becomes "MoRoooooo".
    code = code
      .toUpperCase()
      .replace(/[\[\]\s]/g, "")
      .replace(/[0-9]/g, "");

    if (code.length !== 9) {
      throw new Error(
        `Invalid code length. Expected 9 spawn letters, got ${code.length}.`,
      );
    }

    if (!/^[OYBRXM]{9}$/.test(code)) {
      throw new Error(
        "Invalid code. Only use o, Y, B, R, X, and M.",
      );
    }

    return code;
  };

  const buildUrlFromCode = (rawCode: string) => {
    const code = parseCode(rawCode);

    const mobs = {
      mager: [] as number[][],
      ranger: [] as number[][],
      melee: [] as number[][],
      blob: [] as number[][],
      bat: [] as number[][],
    };

    for (let i = 0; i < code.length; i++) {
      const letter = code[i];
      const spawn = trainerSpawnSlots[i];

      switch (letter) {
        case "M":
          mobs.mager.push(spawn);
          break;

        case "R":
          mobs.ranger.push(spawn);
          break;

        case "X":
          mobs.melee.push(spawn);
          break;

        case "B":
          mobs.blob.push(spawn);
          break;

        case "Y":
          mobs.bat.push(spawn);
          break;

        case "O":
          break;
      }
    }

    return (
      "/?wave=0" +
      `&mager=${encodeURIComponent(JSON.stringify(mobs.mager))}` +
      `&ranger=${encodeURIComponent(JSON.stringify(mobs.ranger))}` +
      `&melee=${encodeURIComponent(JSON.stringify(mobs.melee))}` +
      `&blob=${encodeURIComponent(JSON.stringify(mobs.blob))}` +
      `&bat=${encodeURIComponent(JSON.stringify(mobs.bat))}` +
      "&copyable"
    );
  };

  const loadCode = () => {
    try {
      const url = buildUrlFromCode(input.value);
      window.location.href = url;
    } catch (error) {
      if (message) {
        message.innerText =
          error instanceof Error ? error.message : "Invalid Inferno Scouter code.";
        message.style.color = "red";
      }
    }
  };

  button.addEventListener("click", loadCode);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadCode();
    }
  });
}

initializeOneTickTraining() {
  const scenarioSelect = document.getElementById(
    "oneTickScenario",
  ) as HTMLSelectElement;

  const loadButton = document.getElementById(
    "loadOneTickScenario",
  ) as HTMLButtonElement;

  if (!scenarioSelect || !loadButton) {
    return;
  }

  // These coordinates use the trainer's existing custom-wave coordinate system.
  // importSpawn() later adds +11 and +14 to these values.
  const stackTile = [16, 17];
  const sideTileOne = [15, 17];
  const sideTileTwo = [17, 17];

  const scenarios: Record<
    string,
    {
      mager: number[][];
      ranger: number[][];
      melee: number[][];
      blob: number[][];
      bat: number[][];
    }
  > = {
    mage_ranger: {
      mager: [stackTile],
      ranger: [stackTile],
      melee: [],
      blob: [],
      bat: [],
    },

    mage_melee: {
      mager: [stackTile],
      ranger: [],
      melee: [stackTile],
      blob: [],
      bat: [],
    },

    ranger_melee: {
      mager: [],
      ranger: [stackTile],
      melee: [stackTile],
      blob: [],
      bat: [],
    },

    mage_ranger_blob: {
      mager: [stackTile],
      ranger: [stackTile],
      melee: [],
      blob: [sideTileOne],
      bat: [],
    },

    two_blobs_ranger: {
      mager: [],
      ranger: [stackTile],
      melee: [],
      blob: [sideTileOne, sideTileTwo],
      bat: [],
    },

    two_blobs_mager: {
      mager: [stackTile],
      ranger: [],
      melee: [],
      blob: [sideTileOne, sideTileTwo],
      bat: [],
    },

    mage_ranger_melee: {
      mager: [stackTile],
      ranger: [stackTile],
      melee: [stackTile],
      blob: [],
      bat: [],
    },

    blob_ranger_melee: {
      mager: [],
      ranger: [stackTile],
      melee: [stackTile],
      blob: [sideTileOne],
      bat: [],
    },
  };

  const buildScenarioUrl = (scenarioKey: string) => {
    const scenario = scenarios[scenarioKey];

    if (!scenario) {
      return "/?wave=0";
    }

    return (
      "/?wave=0" +
      `&mager=${encodeURIComponent(JSON.stringify(scenario.mager))}` +
      `&ranger=${encodeURIComponent(JSON.stringify(scenario.ranger))}` +
      `&melee=${encodeURIComponent(JSON.stringify(scenario.melee))}` +
      `&blob=${encodeURIComponent(JSON.stringify(scenario.blob))}` +
      `&bat=${encodeURIComponent(JSON.stringify(scenario.bat))}` +
      "&copyable&autoplay=true"
    );
  };

  loadButton.addEventListener("click", () => {
    window.location.href = buildScenarioUrl(scenarioSelect.value);
  });
}

startAutoplayIfRequested() {
  const shouldAutoplay = BrowserUtils.getQueryVar("autoplay") === "true";

  if (!shouldAutoplay) {
    return;
  }

  // Wait until the trainer has fully rendered and the play button exists.
  setTimeout(() => {
    const pauseResumeButton = document.getElementById(
      "pauseResumeLink",
    ) as HTMLButtonElement;

    if (!pauseResumeButton) {
      return;
    }

    // Only start if it is actually paused.
    if (this.world.isPaused) {
      pauseResumeButton.click();
    }
  }, 1000);
}

initializeCustomStatsPanel() {
  const savedStats = JSON.parse(
    localStorage.getItem("inferno_custom_stats_v1") || "{}",
  );

  const useCustomStats = document.getElementById(
    "useCustomStats",
  ) as HTMLInputElement;

  if (!useCustomStats) {
    return;
  }

  useCustomStats.checked = savedStats.enabled === true;

  const setInputValue = (id: string, value: number) => {
    const input = document.getElementById(id) as HTMLInputElement;

    if (input) {
      input.value = String(value);
    }
  };

  setInputValue("customAttack", savedStats.attack ?? 90);
  setInputValue("customStrength", savedStats.strength ?? 99);
  setInputValue("customDefence", savedStats.defence ?? 99);
  setInputValue("customRange", savedStats.range ?? 99);
  setInputValue("customMagic", savedStats.magic ?? 94);
  setInputValue("customPrayer", savedStats.prayer ?? 80);
  setInputValue("customHitpoint", savedStats.hitpoint ?? 99);
  setInputValue("customAgility", savedStats.agility ?? 71);
}

initialiseRegion() {
    const waveInput: HTMLInputElement = document.getElementById("waveinput") as HTMLInputElement;


    const exportWaveInput: HTMLButtonElement = document.getElementById("exportCustomWave") as HTMLButtonElement;
    const editWaveInput: HTMLButtonElement = document.getElementById("editWave") as HTMLButtonElement;

    editWaveInput.addEventListener("click", () => {
      const magers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_ZEK;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const rangers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_XIL;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const meleers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_IM_KOT;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const blobs = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_AK;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const bats = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_MEJ_RAJ;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const url = `/?wave=0&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(
        rangers,
      )}&melee=${JSON.stringify(meleers)}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`;
      window.location.href = url;
    });
    exportWaveInput.addEventListener("click", () => {
      const magers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_ZEK;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const rangers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_XIL;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const meleers = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_IM_KOT;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const blobs = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_AK;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const bats = filter(this.mobs, (mob: Mob) => {
        return mob.mobName() === EntityNames.JAL_MEJ_RAJ;
      }).map((mob: Mob) => {
        return [mob.location.x - 11, mob.location.y - 14];
      });

      const url = `/?wave=74&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(rangers)}&melee=${JSON.stringify(
        meleers,
      )}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`;
      window.location.href = url;
    });

    // create player
    const player = new Player(this, {
      x: parseInt(BrowserUtils.getQueryVar("x")) || 25,
      y: parseInt(BrowserUtils.getQueryVar("y")) || 25,
    });

    this.addPlayer(player);

    const loadoutType = this.initializeAndGetLoadoutType();
    const onTask = this.initializeAndGetOnTask();
    const southPillar = this.initializeAndGetSouthPillar();
    const westPillar = this.initializeAndGetWestPillar();
    const northPillar = this.initializeAndGetNorthPillar();

    this.initializeAndGetUse3dView();
    this.initializeWaveProgressionToggle();
    this.initializeSpawnIndicatorsToggle();
    this.initializeDisplaySetTimerToggle();
    this.initializeFourTickCycle();
    this.initializeInfernoScouterCodeImport();
    this.initializeOneTickTraining();
    this.initializeCustomStatsPanel();
    this.wave = parseInt(BrowserUtils.getQueryVar("wave"));

    if (isNaN(this.wave)) {
      this.wave = 62;
    }
    if (this.wave < 0) {
      this.wave = 0;
    }
    if (this.wave > InfernoWaves.waves.length + 8) {
      this.wave = InfernoWaves.waves.length + 8;
    }

    const loadout = new InfernoLoadout(this.wave, loadoutType, onTask);
    loadout.setStats(player); // flip this around one day
    player.setUnitOptions(loadout.getLoadout());

    this.attackCooldownOverlay = new AttackCooldownOverlay(this, player);
this.addEntity(this.attackCooldownOverlay);

const originalDidAttack = player.didAttack.bind(player);

player.didAttack = () => {
  originalDidAttack();

  const weaponName = player.equipment.weapon?.itemName;

  const isBowAttack =
    weaponName === ItemName.BOWFA ||
    weaponName === ItemName.TWISTED_BOW;

  if (isBowAttack) {
    this.attackCooldownOverlay?.show();
  }
};

    if (this.wave < 67 || this.wave >= 70) {
      // Add pillars
      InfernoPillar.addPillarsToWorld(this, southPillar, westPillar, northPillar);
    }

    const randomPillar = (shuffle(this.entities.filter((entity) => entity.entityName() === EntityNames.PILLAR)) || [
      null,
    ])[0]; // Since we've only added pillars this is safe. Do not move to after movement blockers.

    for (let x = 10; x < 41; x++) {
      this.addEntity(new InvisibleMovementBlocker(this, { x, y: 13 }));
      this.addEntity(new InvisibleMovementBlocker(this, { x, y: 44 }));
    }
    for (let y = 14; y < 44; y++) {
      this.addEntity(new InvisibleMovementBlocker(this, { x: 10, y }));
      this.addEntity(new InvisibleMovementBlocker(this, { x: 40, y }));
    }

    const bat = BrowserUtils.getQueryVar("bat") || "[]";
    const blob = BrowserUtils.getQueryVar("blob") || "[]";
    const melee = BrowserUtils.getQueryVar("melee") || "[]";
    const ranger = BrowserUtils.getQueryVar("ranger") || "[]";
    const mager = BrowserUtils.getQueryVar("mager") || "[]";
    const replayLink = document.getElementById("replayLink") as HTMLLinkElement;

    function importSpawn(region: Region) {
      try {
        JSON.parse(mager).forEach((spawn: number[]) =>
          region.addMob(new JalZek(region, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
        );
        JSON.parse(ranger).forEach((spawn: number[]) =>
          region.addMob(new JalXil(region, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
        );
        JSON.parse(melee).forEach((spawn: number[]) =>
          region.addMob(new JalImKot(region, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
        );
        JSON.parse(blob).forEach((spawn: number[]) =>
          region.addMob(new JalAk(region, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
        );
        JSON.parse(bat).forEach((spawn: number[]) =>
          region.addMob(new JalMejRah(region, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })),
        );

        InfernoWaves.spawnNibblers(3, region, randomPillar).forEach(region.addMob.bind(region));

        replayLink.href = `/${window.location.search}`;
      } catch (ex) {
        console.log("failed to import wave from inferno stats", ex);
      }
    }
    // Add mobs
    if (this.wave === 0) {
      // world.getReadyTimer = 0;
      player.location = { x: 28, y: 17 };
      this.world.getReadyTimer = -1;

      // Clear death store when starting any wave
      InfernoMobDeathStore.clearDeadMobs();

      // Use our spawn indicator system instead of manual tile markers
      const spawns = InfernoWaves.getRandomSpawns();
      this.updateSpawnIndicators(spawns);

      importSpawn(this);
    } else if (this.wave < 67) {
      player.location = { x: 28, y: 17 };
      if (bat != "[]" || blob != "[]" || melee != "[]" || ranger != "[]" || mager != "[]") {
        // Backwards compatibility layer for runelite plugin
        this.wave = 1;

        // Clear death store when starting any wave
        InfernoMobDeathStore.clearDeadMobs();

        importSpawn(this);
      } else {
        // Native approach
        const customSpawns = BrowserUtils.getQueryVar("spawns")
          ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar("spawns")))
          : undefined;

        this.spawnRegularWave(player, randomPillar, customSpawns);
      }
    } else if (this.wave === 67) {
      // Clear death store when starting special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 18, y: 25 };
      const jad = new JalTokJad(
        this,
        { x: 23, y: 27 },
        { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false },
      );
      this.addMob(jad);
    } else if (this.wave === 68) {
      // Clear death store when starting special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 25, y: 27 };

      const stunTimers = [1, 4, 7].sort(() => 0.5 - Math.random());

      const jad1 = new JalTokJad(
        this,
        { x: 18, y: 24 },
        { aggro: player, attackSpeed: 9, stun: stunTimers[0], healers: 3, isZukWave: false },
      );
      this.addMob(jad1);

      const jad2 = new JalTokJad(
        this,
        { x: 28, y: 24 },
        { aggro: player, attackSpeed: 9, stun: stunTimers[1], healers: 3, isZukWave: false },
      );
      this.addMob(jad2);

      const jad3 = new JalTokJad(
        this,
        { x: 23, y: 35 },
        { aggro: player, attackSpeed: 9, stun: stunTimers[2], healers: 3, isZukWave: false },
      );
      this.addMob(jad3);
    } else if (this.wave === 69) {
      // Clear death store when starting special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 25, y: 15 };

      // spawn zuk
      const shieldDirection = this.initializeAndGetShieldDirection();
      const shield = new ZukShield(this, { x: 23, y: 13 }, { aggro: player }, shieldDirection);
      this.addMob(shield);

      this.addMob(new TzKalZuk(this, { x: 22, y: 8 }, { aggro: player }));

      this.addEntity(new Wall(this, { x: 21, y: 8 }));
      this.addEntity(new Wall(this, { x: 21, y: 7 }));
      this.addEntity(new Wall(this, { x: 21, y: 6 }));
      this.addEntity(new Wall(this, { x: 21, y: 5 }));
      this.addEntity(new Wall(this, { x: 21, y: 4 }));
      this.addEntity(new Wall(this, { x: 21, y: 3 }));
      this.addEntity(new Wall(this, { x: 21, y: 2 }));
      this.addEntity(new Wall(this, { x: 21, y: 1 }));
      this.addEntity(new Wall(this, { x: 21, y: 0 }));
      this.addEntity(new Wall(this, { x: 29, y: 8 }));
      this.addEntity(new Wall(this, { x: 29, y: 7 }));
      this.addEntity(new Wall(this, { x: 29, y: 6 }));
      this.addEntity(new Wall(this, { x: 29, y: 5 }));
      this.addEntity(new Wall(this, { x: 29, y: 4 }));
      this.addEntity(new Wall(this, { x: 29, y: 3 }));
      this.addEntity(new Wall(this, { x: 29, y: 2 }));
      this.addEntity(new Wall(this, { x: 29, y: 1 }));
      this.addEntity(new Wall(this, { x: 29, y: 0 }));

      this.addEntity(new TileMarker(this, { x: 14, y: 14 }, "#00FF00", 1, false));

      this.addEntity(new TileMarker(this, { x: 16, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 17, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 18, y: 14 }, "#FF0000", 1, false));

      this.addEntity(new TileMarker(this, { x: 20, y: 14 }, "#00FF00", 1, false));

      this.addEntity(new TileMarker(this, { x: 30, y: 14 }, "#00FF00", 1, false));

      this.addEntity(new TileMarker(this, { x: 32, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 33, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 34, y: 14 }, "#FF0000", 1, false));

      this.addEntity(new TileMarker(this, { x: 36, y: 14 }, "#00FF00", 1, false));
    } else if (this.wave === 74) {
      player.location = { x: 28, y: 17 };
      importSpawn(this);
    }

    document.getElementById("playWaveNum").addEventListener("click", () => {
      window.location.href = `/?wave=${waveInput.value || this.wave}`;
    });

    document
      .getElementById("pauseResumeLink")
      .addEventListener("click", () => (this.world.isPaused ? this.world.startTicking() : this.world.stopTicking()));

    waveInput.addEventListener("focus", () => (ControlPanelController.controller.isUsingExternalUI = true));
    waveInput.addEventListener("focusout", () => (ControlPanelController.controller.isUsingExternalUI = false));

    // set timer
    let timer_mode = "Start Set Timer";
    let timer_time = 210;

    setInterval(() => {
      if (
        timer_mode === "Start Set Timer" ||
        timer_mode === "Resume"
      ) {
        return;
      }
      timer_time--;
      if (timer_time <= 0) {
        timer_time = 210;
        timer_mode = "Start Set Timer";
      }
      document.getElementById("set_timer_time").innerText =
        String(Math.floor(timer_time / 60)) +
        ":" +
        String(timer_time % 60).padStart(2, "0");
      document.getElementById("set_timer_button").innerText =
        timer_mode;
    }, 1000);
    document
      .getElementById("set_timer_button")
      .addEventListener("click", () => {
        if (timer_mode === "Start Set Timer") {
          timer_mode = "Pause";
        } else if (timer_mode === "Pause") {
          timer_mode = "Resume";
        } else if (timer_mode === "Resume") {
          timer_mode = "Reset";
          timer_time += 105;
        } else if (timer_mode === "Reset") {
          timer_time = 210;
          timer_mode = "Start Set Timer";
        }
        document.getElementById("set_timer_time").innerText =
          String(Math.floor(timer_time / 60)) +
          ":" +
          String(timer_time % 60).padStart(2, "0");
        document.getElementById("set_timer_button").innerText =
          timer_mode;
      });


    // Add 3d scene
    if (Settings.use3dView) {
      this.addEntity(new InfernoScene(this, { x: 0, y: 48 }));
    }

    player.perceivedLocation = player.location;
player.destinationLocation = player.location;

this.startAutoplayIfRequested();

return { player };
  }

  drawWorldBackground(context: OffscreenCanvasRenderingContext2D, scale: number) {
    context.fillStyle = "black";
    context.fillRect(0, 0, 10000000, 10000000);
    if (this.mapImage) {
      const ctx = context as any;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      context.fillStyle = "white";

      context.drawImage(this.mapImage, 0, 0, this.width * scale, this.height * scale);

      ctx.webkitImageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      context.imageSmoothingEnabled = true;
    }
  }

  drawDefaultFloor() {
    // replaced by an Entity in 3d view
    return !Settings.use3dView;
  }

  // Spawn indicator management methods
  private clearSpawnIndicators() {
    this.spawnIndicators.forEach(indicator => {
      this.removeEntity(indicator);
    });
    this.spawnIndicators = [];
  }

  private updateSpawnIndicators(spawns: Location[]) {
    // Clear existing indicators
    this.clearSpawnIndicators();

    // Only show spawn indicators if the setting is enabled
    if (!InfernoSettings.spawnIndicators) {
      return;
    }

    console.log("Updating spawn indicators for spawns:", spawns);

    // Add new indicators for current spawn points
    spawns.forEach((spawn: Location, index: number) => {
      // Create multiple size indicators with completely isolated location objects
      [2, 3, 4].forEach((size: number) => {
        const color = index < 9 ? "#00FF0050" : "#FF000050"; // Green for valid spawns, red for overflow
        // Create a completely isolated copy of the location to prevent any reference sharing
        const isolatedLocation = { x: spawn.x, y: spawn.y };
        const tileMarker = new TileMarker(this, isolatedLocation, color, size, false);
        this.addEntity(tileMarker);
        this.spawnIndicators.push(tileMarker);
      });
    });

    console.log(`Added ${this.spawnIndicators.length} spawn indicator entities`);
  }

  postTick() {
  super.postTick();

  this.attackCooldownOverlay?.sync();

  this.fourTickCycleIndex = (this.fourTickCycleIndex + 1) % 4;
  this.updateFourTickCycleDisplay();

  this.handleWaveProgression();
}

  private handleWaveProgression() {
    // Only enable wave progression for waves 1-69 and if the setting is enabled
    if (this.wave >= 1 && this.wave <= 69 && InfernoSettings.waveProgression) {
      this.waveProgressionEnabled = true;
    } else {
      this.waveProgressionEnabled = false;
    }

    if (!this.waveProgressionEnabled) {
      return;
    }

    // Count current alive mobs (with special handling for nibblers)
    const aliveMobs = this.mobs.filter(mob => {
      return mob.dying === -1;
    });

    const currentMobCount = aliveMobs.length;

    // Check if wave just completed (all relevant mobs dead)
    if (currentMobCount === 0 && this.lastMobCount > 0 && this.waveCompleteTimer === -1) {
      // Wave completed! Start 9-tick timer (1 extra tick to allow for bloblet spawning)
      this.waveCompleteTimer = 9;
      console.log(`Wave ${this.wave} completed! Next wave spawning in 9 ticks (allowing for bloblets)...`);

      // Update wave display
      const waveInput = document.getElementById("waveinput") as HTMLInputElement;
      if (waveInput) {
        waveInput.value = String(this.wave + 1);
      }
    }

    // Cancel wave completion if mobs spawned during countdown (e.g., bloblets)
    if (this.waveCompleteTimer > 0 && currentMobCount > 0) {
      console.log(`Wave ${this.wave} completion cancelled - new mobs detected (likely bloblets)`);
      this.waveCompleteTimer = -1;

      // Revert wave display
      const waveInput = document.getElementById("waveinput") as HTMLInputElement;
      if (waveInput) {
        waveInput.value = String(this.wave);
      }
    }

    // Handle countdown timer
    if (this.waveCompleteTimer > 0) {
      this.waveCompleteTimer--;

      if (this.waveCompleteTimer === 0) {
        // Timer finished, spawn next wave
        this.spawnNextWave();
        this.waveCompleteTimer = -1;
      }
    }

    this.lastMobCount = currentMobCount;
  }

  private spawnRegularWave(player: any, randomPillar: any, customSpawns?: Location[]) {
    // Common logic for spawning regular waves (1-66)
    const spawns = customSpawns || InfernoWaves.getRandomSpawns();

    // Clear death store to prevent resurrection of mobs from previous waves
    InfernoMobDeathStore.clearDeadMobs();

    // Add spawn indicators before spawning mobs
    this.updateSpawnIndicators(spawns);

    // Spawn the mobs
    InfernoWaves.spawn(this, player, randomPillar, spawns, this.wave).forEach(this.addMob.bind(this));

    // Update replay link and wave input
    const encodedSpawn = encodeURIComponent(JSON.stringify(spawns));
    const replayLink = document.getElementById("replayLink") as HTMLLinkElement;
    if (replayLink) {
      replayLink.href = `/?wave=${this.wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`;
    }

    const waveInput = document.getElementById("waveinput") as HTMLInputElement;
    if (waveInput) {
      waveInput.value = String(this.wave);
    }
  }

  private spawnNextWave() {
    if (this.wave >= 69) {
      // Don't spawn anything after wave 69
      console.log("Inferno completed! No more waves to spawn.");
      this.waveProgressionEnabled = false;
      return;
    }

    // Increment to next wave
    this.wave++;
    console.log(`Spawning wave ${this.wave}...`);

    // Get player reference
    const player = this.players[0];
    if (!player) {
      console.error("No player found for wave progression");
      return;
    }

    // Get random pillar for nibblers
    const randomPillar = (shuffle(this.entities.filter((entity) => entity.entityName() === EntityNames.PILLAR)) || [null])[0];

    // Spawn the next wave based on wave number
    if (this.wave >= 1 && this.wave <= 66) {
      // Regular waves (1-66)
      this.spawnRegularWave(player, randomPillar);
    } else if (this.wave === 67) {
      // Jad wave - clear spawn indicators since it's a special spawn
      this.clearSpawnIndicators();

      // Clear death store for special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 18, y: 25 };
      const jad = new JalTokJad(
        this,
        { x: 23, y: 27 },
        { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false },
      );
      this.addMob(jad);
    } else if (this.wave === 68) {
      // Triple Jad wave - clear spawn indicators since it's a special spawn
      this.clearSpawnIndicators();

      // Clear death store for special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 25, y: 27 };

      const jad1 = new JalTokJad(
        this,
        { x: 18, y: 24 },
        { aggro: player, attackSpeed: 9, stun: 1, healers: 3, isZukWave: false },
      );
      this.addMob(jad1);

      const jad2 = new JalTokJad(
        this,
        { x: 28, y: 24 },
        { aggro: player, attackSpeed: 9, stun: 7, healers: 3, isZukWave: false },
      );
      this.addMob(jad2);

      const jad3 = new JalTokJad(
        this,
        { x: 23, y: 35 },
        { aggro: player, attackSpeed: 9, stun: 4, healers: 3, isZukWave: false },
      );
      this.addMob(jad3);
    } else if (this.wave === 69) {
      // Zuk wave
      // Clear death store for special waves
      InfernoMobDeathStore.clearDeadMobs();

      player.location = { x: 25, y: 15 };

      // Remove pillars for Zuk wave
      this.entities = this.entities.filter(entity => entity.entityName() !== EntityNames.PILLAR);

      // Spawn zuk
      const shieldDirection = this.initializeAndGetShieldDirection();
      const shield = new ZukShield(this, { x: 23, y: 13 }, { aggro: player }, shieldDirection);
      this.addMob(shield);

      this.addMob(new TzKalZuk(this, { x: 22, y: 8 }, { aggro: player }));

      // Add walls
      for (let y = 0; y <= 8; y++) {
        this.addEntity(new Wall(this, { x: 21, y }));
        this.addEntity(new Wall(this, { x: 29, y }));
      }

      // Add tile markers
      this.addEntity(new TileMarker(this, { x: 14, y: 14 }, "#00FF00", 1, false));
      this.addEntity(new TileMarker(this, { x: 16, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 17, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 18, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 20, y: 14 }, "#00FF00", 1, false));
      this.addEntity(new TileMarker(this, { x: 30, y: 14 }, "#00FF00", 1, false));
      this.addEntity(new TileMarker(this, { x: 32, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 33, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 34, y: 14 }, "#FF0000", 1, false));
      this.addEntity(new TileMarker(this, { x: 36, y: 14 }, "#00FF00", 1, false));
    }

    // Update wave input display
    const waveInput = document.getElementById("waveinput") as HTMLInputElement;
    if (waveInput) {
      waveInput.value = String(this.wave);
    }
  }

  getSidebarContent() {
    return SidebarContent;
  }
}
