'use strict';

import { Player } from '../../sdk/Player';
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";
import { Verzik } from "./js/mobs/Verzik";
import { Scenario } from "../../sdk/Scenario";
import { ScytheOfVitur } from "../weapons/ScytheOfVitur"
import { Region } from '../../sdk/Region';
import { Item } from '../../sdk/Item';
import { Settings } from '../../sdk/Settings';

export class VerzikP3 extends Scenario {
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

  initialize(region: Region) {
    this.initializeMap()
    // Add player
    const player = new Player(
      region,
      { x: parseInt(BrowserUtils.getQueryVar("x")) || 17, y: parseInt(BrowserUtils.getQueryVar("y")) || 3},
      { weapon: new ScytheOfVitur() });
    region.setPlayer(player);

    // Add mobs
    region.addMob(new Verzik(region, {x: 16, y: 16}, { aggro: player}));
  }
  
  drawRegionBackground(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.gridCanvas, 0, 0);
  }
}