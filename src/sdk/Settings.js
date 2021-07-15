'use strict';

import { BrowserUtils } from "./Utils/BrowserUtils";

export class Settings {
  static tileSize = 23;
  static framesPerTick = 30;
  static tickMs =  600;
  static playsAudio = false
  static inputDelay = 100;
  static rotated = BrowserUtils.getQueryVar("cam_direction") || "south";
}
