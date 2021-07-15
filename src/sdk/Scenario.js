'use strict';

import { TwistedBow } from "../content/weapons/TwistedBow";

// Base class for any trainer scenario.
export class Scenario {
  
  constructor() {
  }

  getName() {
    return "My Scenario";
  }

  getRegionWidth() {
    return 29;
  }

  getRegionHeight() {
    return 30;
  }

  getInventory() {
    return [];
  }

  // Spawn entities, NPCs, player and initialize any extra UI controls.
  initialize(region, document) {
  }
}
