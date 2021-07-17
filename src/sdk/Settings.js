'use strict';

import { BrowserUtils } from "./Utils/BrowserUtils";

export class Settings {
  static tileSize;
  static framesPerTick;
  static tickMs =  600;
  static playsAudio;
  static inputDelay;
  static rotated;
  static scenario;

  static persistToStorage(){
    window.localStorage.setItem('tileSize', Settings.tileSize);
    window.localStorage.setItem('framesPerTick', Settings.framesPerTick);
    window.localStorage.setItem('playsAudio', Settings.playsAudio);
    window.localStorage.setItem('inputDelay', Settings.inputDelay);
    window.localStorage.setItem('rotated', Settings.rotated);
    window.localStorage.setItem('scenario', Settings.scenario);

  }
  static readFromStorage(){
    Settings.tileSize = parseInt(window.localStorage.getItem('tileSize')) || 23;
    Settings.framesPerTick = parseInt(window.localStorage.getItem('framesPerTick')) || 30;
    Settings.playsAudio = window.localStorage.getItem('playsAudio') === 'true' || false;
    Settings.inputDelay = parseInt(window.localStorage.getItem('inputDelay')) || 100;
    Settings.rotated = window.localStorage.getItem('rotated') || 'south';
    Settings.scenario = window.localStorage.getItem('scenario') || 'inferno';
  }
}
