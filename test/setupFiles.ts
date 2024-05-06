/* eslint-disable @typescript-eslint/no-empty-function */
jest.mock("../src/sdk/ControlPanelController");
jest.mock("../src/sdk/MapController");
jest.mock("../src/sdk/XpDropController");
jest.mock("../src/sdk/utils/Assets");
jest.mock("../src/sdk/utils/SoundCache");
jest.mock("three", () => ({
  Scene: class Scene {
    public add(): void {
      return;
    }
  },
  WebGLRenderer: class WebGlRenderer {
    public render(): void {
      return;
    }
    public setSize(): void {
      return;
    }
  },
  GLTFLoader: class GLTFLoader {
    constructor() {}
    setMeshoptDecoder() {}
  },
}));

import { Random } from "../src/sdk/Random";
import { Settings } from "../src/sdk/Settings";

jest.spyOn(document, "getElementById").mockImplementation((elementId: string) => {
  const c = document.createElement("canvas");
  c.ariaLabel = elementId;
  return c;
});

const nextRandom = [];

export const forceRandom = (value: number) => {
  nextRandom.push(value);
};

Random.setRandom(() => {
  if (nextRandom.length > 0) {
    return nextRandom.shift();
  }
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();
