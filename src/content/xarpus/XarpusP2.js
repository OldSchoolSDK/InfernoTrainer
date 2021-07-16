'use strict';

import { Player } from '../../sdk/Player';
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";
import { Xarpus } from "./js/mobs/Xarpus";
import { Scenario } from "../../sdk/Scenario";
import { ScytheOfVitur } from "../weapons/ScytheOfVitur"

export class XarpusP2 extends Scenario {
  
  getRegionWidth() {
    return 15;
  }

  getRegionHeight() {
    return 15;
  }

  getGridColor1() {
    return "#333";
  }

  getGridColor2() {
    return "#222";
  }

  getName() {
    return "Xarpus P2";
  }

  getInventory() {
    return [];
  }

  initialize(region) {
    // Add player
    const player = new Player(
      region,
      { x: parseInt(BrowserUtils.getQueryVar("x")) || 7, y: parseInt(BrowserUtils.getQueryVar("y")) || 12},
      { weapon: new ScytheOfVitur() });
    region.setPlayer(player);

    // Add mobs
    region.addMob(new Xarpus(region, {x: 5, y: 9}, { aggro: player}));
  }
}