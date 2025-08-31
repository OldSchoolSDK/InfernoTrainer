"use strict";

export class InfernoSettings {
  static waveProgression = false;
  static spawnIndicators = false;
  static displaySetTimer = false;

  static persistToStorage() {
    window.localStorage.setItem("waveProgression", String(InfernoSettings.waveProgression));
    window.localStorage.setItem("spawnIndicators", String(InfernoSettings.spawnIndicators));
    window.localStorage.setItem("displaySetTimer", String(InfernoSettings.displaySetTimer));
  }

  static readFromStorage() {
    InfernoSettings.waveProgression = window.localStorage.getItem("waveProgression") === "true" || false;
    InfernoSettings.spawnIndicators = window.localStorage.getItem("spawnIndicators") === "true" || false;
    InfernoSettings.displaySetTimer = window.localStorage.getItem("displaySetTimer") === "true" || false;
  }
}