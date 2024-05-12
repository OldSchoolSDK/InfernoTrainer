/* eslint-disable @typescript-eslint/no-empty-function */

global.OffscreenCanvas = jest.fn().mockImplementation((width: number, height: number) => {
  return {
    height,
    width,
    oncontextlost: jest.fn(),
    oncontextrestored: jest.fn(),
    getContext: jest.fn(() => undefined),
    convertToBlob: jest.fn(),
    transferToImageBitmap: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

global.fetch = jest.fn().mockImplementation(() => ({
  arrayBuffer: () => null,
}));

import { Random, Settings } from "@supalosa/oldschool-trainer-sdk";

jest.mock("@supalosa/oldschool-trainer-sdk", () => {
  const originalModule = jest.requireActual<typeof import("@supalosa/oldschool-trainer-sdk")>(
    "@supalosa/oldschool-trainer-sdk",
  );
  return {
    ...originalModule,
    Assets: {
      getAssetUrl(x: any) {
        return x;
      }
    },
    SoundCache: {
      preload() {},
      play() {}
    }
  };
});

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
jest.spyOn(document, "getElementById").mockImplementation((elementId: string) => {
  const c = document.createElement("canvas");
  c.ariaLabel = elementId;
  return c;
});

const nextRandom = [];

Random.setRandom(() => {
  if (nextRandom.length > 0) {
    return nextRandom.shift();
  }
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();
