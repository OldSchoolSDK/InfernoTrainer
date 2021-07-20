'use strict';

import { Player } from '../../sdk/Player';
import { BrowserUtils } from "../../sdk/Utils/BrowserUtils";
import { Verzik } from "./js/mobs/Verzik";
import { Scenario } from "../../sdk/Scenario";
import { ScytheOfVitur } from "../weapons/ScytheOfVitur"
import { Region } from '../../sdk/Region';
import { Item } from '../../sdk/Item';

export class VerzikP3 extends Scenario {
  
  getName() {
    return "Verzik Phase 3";
  }

  getInventory(): Item[] {
    return [];
  }

  initialize(region: Region) {
    // Add player
    const player = new Player(
      region,
      { x: parseInt(BrowserUtils.getQueryVar("x")) || 17, y: parseInt(BrowserUtils.getQueryVar("y")) || 3},
      { weapon: new ScytheOfVitur() });
    region.setPlayer(player);

    // Add mobs
    region.addMob(new Verzik(region, {x: 16, y: 16}, { aggro: player}));
  }
}