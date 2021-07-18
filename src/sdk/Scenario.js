'use strict'

// Base class for any trainer scenario.
export class Scenario {
  getName () {
    return 'My Scenario'
  }

  getRegionWidth () {
    return 29
  }

  getRegionHeight () {
    return 30
  }

  getInventory () {
    return []
  }

  // Spawn entities, NPCs, player and initialize any extra UI controls.
  initialize (region, document) {
  }
}
