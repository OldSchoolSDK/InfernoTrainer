"use strict";

import InfernoMapImage from "../assets/images/map.png";

import { CardinalDirection, Region } from "../../../sdk/Region";
import { Settings } from "../../../sdk/Settings";
import { ImageLoader } from "../../../sdk/utils/ImageLoader";
import { Viewport } from "../../../sdk/Viewport";
import { JalAk } from "./mobs/JalAk";
import { JalImKot } from "./mobs/JalImKot";
import { JalMejRah } from "./mobs/JalMejRah";
import { JalXil } from "./mobs/JalXil";
import { JalZek } from "./mobs/JalZek";

/* eslint-disable @typescript-eslint/no-explicit-any */

export class InfernoRegion extends Region {
  wave: number;
  mapImage: HTMLImageElement = ImageLoader.createImage(InfernoMapImage);

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
          Viewport.viewport.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalMejRah(this, { x, y }, { aggro: Viewport.viewport.player });
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
          Viewport.viewport.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalAk(this, { x, y }, { aggro: Viewport.viewport.player });
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
          Viewport.viewport.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalImKot(this, { x, y }, { aggro: Viewport.viewport.player });
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
          Viewport.viewport.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalXil(this, { x, y }, { aggro: Viewport.viewport.player });
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
          Viewport.viewport.clickController.yellowClick();
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalZek(this, { x, y }, { aggro: Viewport.viewport.player });
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
}
