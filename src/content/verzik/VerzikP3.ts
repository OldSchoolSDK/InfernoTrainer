'use strict';

import { Player } from '../../sdk/Player';
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";
import { Verzik } from "./js/mobs/Verzik";
import { Region } from "../../sdk/Region";
import { ScytheOfVitur } from "../weapons/ScytheOfVitur"
import { World } from '../../sdk/World';
import { Item } from '../../sdk/Item';
import { Settings } from '../../sdk/Settings';

export class VerzikP3 extends Region {
  gridCanvas: OffscreenCanvas;

  getName() {
    return "Verzik Phase 3";
  }

  getInventory(): Item[] {
    return [];
  }

  initializeMap() {
    this.gridCanvas = new OffscreenCanvas(this.width * Settings.tileSize, this.height * Settings.tileSize)
    const gridContext = this.gridCanvas.getContext('2d')
    gridContext.fillRect(0, 0, this.width * Settings.tileSize, this.height * Settings.tileSize)
    for (let i = 0; i < this.width * this.height; i++) {
      gridContext.fillStyle = (i % 2) ? '#100' : '#210'
      gridContext.fillRect(
        i % this.width * Settings.tileSize,
        Math.floor(i / this.width) * Settings.tileSize,
        Settings.tileSize,
        Settings.tileSize
      )
    }
  }

  initialize(world: World) {
    this.initializeMap()
    // Add player
    const player = new Player(
      world,
      { x: parseInt(BrowserUtils.getQueryVar("x")) || 17, y: parseInt(BrowserUtils.getQueryVar("y")) || 3},
      { weapon: new ScytheOfVitur() });
    world.setPlayer(player);

    // Add mobs
    world.addMob(new Verzik(world, {x: 16, y: 16}, { aggro: player}));
  }
  
  drawWorldBackground(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.gridCanvas, 0, 0);
  }
}