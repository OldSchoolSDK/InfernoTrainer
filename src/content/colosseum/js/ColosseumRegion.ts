"use strict";

import { Region, Viewport, Settings, Player, CardinalDirection, ImageLoader, Trainer } from "@supalosa/oldschool-trainer-sdk";


import ColosseumMapImage from "../assets/images/map.png";

import { ColosseumLoadout } from "./ColosseumLoadout";
import { ColosseumScene } from "./ColosseumScene";
import { Attacks, SolHeredit as SolHeredit } from "./mobs/SolHeredit";

import SidebarContent from "../sidebar.html";
import { WallMan } from "./entities/WallMan";
import { ColosseumSettings } from "./ColosseumSettings";
import { SolarFlareOrb } from "./entities/SolarFlareOrb";

/* eslint-disable @typescript-eslint/no-explicit-any */

export class ColosseumRegion extends Region {
  mapImage: HTMLImageElement = ImageLoader.createImage(ColosseumMapImage);

  get initialFacing() {
    return CardinalDirection.NORTH;
  }

  getName() {
    return "Fortis Colosseum";
  }

  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }

  rightClickActions(): any[] {
    return [];
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

  initialiseRegion() {
    // create player
    const player = new Player(this, {
      x: 27,
      y: 29,
    });

    this.addPlayer(player);

    const loadout = new ColosseumLoadout("max_melee");
    loadout.setStats(player);
    player.setUnitOptions(loadout.getLoadout());

    // NE 34,18
    // NW 19,18
    // SE 34,33
    // SW 19,33

    for (let xx = 19; xx <= 34; ++xx) {
      this.addEntity(new WallMan(this, { x: xx, y: 18 }));
      this.addEntity(new WallMan(this, { x: xx, y: 33 }));
    }

    for (let yy = 18; yy <= 33; ++yy) {
      this.addEntity(new WallMan(this, { x: 19, y: yy }));
      this.addEntity(new WallMan(this, { x: 34, y: yy }));
    }
    this.addEntity(new WallMan(this, { x: 33, y: 19 }));
    this.addEntity(new WallMan(this, { x: 20, y: 19 }));
    this.addEntity(new WallMan(this, { x: 33, y: 32 }));
    this.addEntity(new WallMan(this, { x: 20, y: 32 }));

    this.addMob(new SolHeredit(this, { x: 25, y: 24 }, { aggro: player }));

    // Add 3d scene
    if (Settings.use3dView) {
      this.addEntity(new ColosseumScene(this, { x: 0, y: 48 }));
    }

    // setup UI and settings
    ColosseumSettings.readFromStorage();

    const setupAttackConfig = (elementId: string, field: keyof typeof ColosseumSettings) => {
      const checkbox = document.getElementById(elementId) as HTMLInputElement;
      checkbox.checked = ColosseumSettings[field] as boolean;
      checkbox.addEventListener("change", () => {
        (ColosseumSettings[field] as boolean) = checkbox.checked;
        ColosseumSettings.persistToStorage();
      });
    };
    setupAttackConfig("use_shield", "useShields");
    setupAttackConfig("use_spears", "useSpears");
    setupAttackConfig("use_triple", "useTriple");
    setupAttackConfig("use_grapple", "useGrapple");
    setupAttackConfig("use_phase_transitions", "usePhaseTransitions");
    const solarFlareDropdown = document.getElementById("solar_flare_level") as HTMLSelectElement;
    solarFlareDropdown.value = ColosseumSettings.solarFlareLevel.toString();
    solarFlareDropdown.addEventListener("change", () => {
      ColosseumSettings.solarFlareLevel = parseInt(solarFlareDropdown.value);
      ColosseumSettings.persistToStorage();
      this.updateSolarFlares();
    });
    this.updateSolarFlares();

    setupAttackConfig("echo_max_hp", "echoMaxHp");
    setupAttackConfig("echo_enrage", "echoEnrage");
    setupAttackConfig("echo_lasers", "echoLasers");

    const creditsButton = document.getElementById("credits_button") as HTMLButtonElement;
    let showCredits = false;
    creditsButton.addEventListener("click", () => {
      showCredits = !showCredits;
      document.getElementById("credits").innerHTML = !showCredits
        ? ""
        : `
      <ul>
        <li>Jagex</li>
        <li>Supalosa (engine and logic)</li>
        <li>Tesla Owner (engine)</li>
        <li>KiwiIskadda (detailed feedback)</li>
        <li>Syndra, Varadium, ro0bo, zyth (early feedback and testing)</li>
        <li>@kattykoo on discord (dm for colosseum tips and tricks)</li>
      </ul>`;
    });
    return {
      player: player,
    };
  }

  private updateSolarFlares() {
    if (ColosseumSettings.solarFlareLevel === 0) {
      this.despawnSolarFlares();
      return;
    }
    if (this.entities.filter((entity) => entity instanceof SolarFlareOrb).length === 0) {
      this.addEntity(new SolarFlareOrb(this, { x: 21, y: 20 }, ColosseumSettings.solarFlareLevel, 2));
      this.addEntity(new SolarFlareOrb(this, { x: 28, y: 20 }, ColosseumSettings.solarFlareLevel, 3));
      this.addEntity(new SolarFlareOrb(this, { x: 21, y: 27 }, ColosseumSettings.solarFlareLevel, 1));
      this.addEntity(new SolarFlareOrb(this, { x: 28, y: 27 }, ColosseumSettings.solarFlareLevel, 0));
    } else {
      this.entities
        .filter((entity) => entity instanceof SolarFlareOrb)
        .forEach((entity) => {
          (entity as SolarFlareOrb).setLevel(ColosseumSettings.solarFlareLevel);
        });
    }
  }

  private despawnSolarFlares() {
    this.entities
      .filter((entity) => entity instanceof SolarFlareOrb)
      .forEach((entity) => {
        entity.dying = 0;
        this.removeEntity(entity);
      });
  }

  private enableReplay = false;
  private replayTick = 1;
  override postTick() {
    if (!this.enableReplay || this.world.getReadyTimer > 0) {
      return;
    }
    // replay mode for debug only
    const player = this.players[0];
    const boss = this.mobs[0] as SolHeredit;
    switch (this.replayTick) {
      case 1:
        boss.stunned = 4;
        player.inventory.find((i) => i.itemName === "Shark")?.inventoryLeftClick(player);
        player.setAggro(boss);
        break;
      case 3:
        player.inventory.find((i) => i.itemName === "Scythe of Vitur")?.inventoryLeftClick(player);
        player.moveTo(24, 22);
        break;
      case 5:
        boss.forceAttack = Attacks.SPEAR;
        player.setAggro(boss);
        break;
      case 7:
        player.moveTo(23, 22);
        break;
      case 8:
        player.setAggro(boss);
        break;
      case 9:
        player.moveTo(24, 21);
        break;
      case 10:
        player.setAggro(boss);
        break;
      case 12:
        boss.currentStats.hitpoint = 1337;
        break;
      case 14:
        player.moveTo(23, 22);
        break;
      case 15:
        player.moveTo(23, 23);
        break;
      case 16:
        player.setAggro(boss);
        break;
      case 17:
        player.moveTo(24, 25);
        break;
      case 18:
        player.moveTo(24, 26);
        break;
      case 19:
        player.moveTo(24, 27);
        break;
      case 20:
        player.moveTo(24, 28);
        break;
      case 21:
        player.setAggro(boss);
        break;
      case 23:
        player.moveTo(25, 29);
        break;
      case 25:
        player.setAggro(boss);
        break;
      case 28:
        player.moveTo(26, 29);
        break;
      case 29:
        player.moveTo(26, 30);
        break;
      case 30:
        player.setAggro(boss);
        break;
      case 31:
        boss.forceAttack = Attacks.SHIELD;
        break;
    }
    ++this.replayTick;
  }

  getSidebarContent() {
    return SidebarContent;
  }
}
