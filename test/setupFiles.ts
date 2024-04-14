/* eslint-disable @typescript-eslint/no-empty-function */
jest.mock("../src/sdk/ControlPanelController");
jest.mock("../src/sdk/MapController");
jest.mock("../src/sdk/XpDropController");

import { Random } from "../src/sdk/Random";
import { Settings } from "../src/sdk/Settings";

jest.spyOn(document, "getElementById").mockImplementation((elementId: string) => {
  const c = document.createElement("canvas");
  c.ariaLabel = elementId;
  return c;
});

Random.setRandom(() => {
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();
