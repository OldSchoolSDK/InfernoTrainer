"use strict";

import type { ShieldDirection } from "./ZukShield";

export class InfernoSettings {
  static waveProgression = false;
  static spawnIndicators = false;
  static displaySetTimer = false;
  static shieldDirection: ShieldDirection = "random";

  static persistToStorage() {
    window.localStorage.setItem("waveProgression", String(InfernoSettings.waveProgression));
    window.localStorage.setItem("spawnIndicators", String(InfernoSettings.spawnIndicators));
    window.localStorage.setItem("displaySetTimer", String(InfernoSettings.displaySetTimer));
    window.localStorage.setItem("shieldDirection", InfernoSettings.shieldDirection);
  }

  static readFromStorage() {
    InfernoSettings.waveProgression = window.localStorage.getItem("waveProgression") === "true" || false;
    InfernoSettings.spawnIndicators = window.localStorage.getItem("spawnIndicators") === "true" || false;
    InfernoSettings.displaySetTimer = window.localStorage.getItem("displaySetTimer") === "true" || false;
    const shieldDir = window.localStorage.getItem("shieldDirection");
    if (shieldDir === "west" || shieldDir === "east" || shieldDir === "random") {
      InfernoSettings.shieldDirection = shieldDir;
    } else {
      InfernoSettings.shieldDirection = "random";
    }
  }
}
