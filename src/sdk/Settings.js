'use strict'

export class Settings {
  static tileSize = 23;
  static framesPerTick = 30;
  static tickMs = 600;
  static playsAudio;
  static inputDelay;
  static rotated;
  static scenario;

  static inventory_key;
  static spellbook_key;
  static equipment_key;
  static prayer_key;

  static is_keybinding = false;

  static persistToStorage () {
    // window.localStorage.setItem('tileSize', Settings.tileSize);
    // window.localStorage.setItem('framesPerTick', Settings.framesPerTick);
    window.localStorage.setItem('playsAudio', Settings.playsAudio)
    window.localStorage.setItem('inputDelay', Settings.inputDelay)
    window.localStorage.setItem('rotated', Settings.rotated)
    window.localStorage.setItem('scenario', Settings.scenario)

    window.localStorage.setItem('inventory_key', Settings.inventory_key)
    window.localStorage.setItem('spellbook_key', Settings.spellbook_key)
    window.localStorage.setItem('equipment_key', Settings.equipment_key)
    window.localStorage.setItem('prayer_key', Settings.prayer_key)

  }

  static readFromStorage () {
    Settings.playsAudio = window.localStorage.getItem('playsAudio') === 'true' || false
    // Settings.tileSize = parseInt(window.localStorage.getItem('tileSize')) || 23;
    // Settings.framesPerTick = parseInt(window.localStorage.getItem('framesPerTick')) || 30;
    Settings.inputDelay = parseInt(window.localStorage.getItem('inputDelay')) || 100
    Settings.rotated = window.localStorage.getItem('rotated') || 'south'
    Settings.scenario = window.localStorage.getItem('scenario') || 'inferno'

    Settings.inventory_key = window.localStorage.getItem('inventory_key') || '4'
    Settings.spellbook_key = window.localStorage.getItem('spellbook_key') || '2'
    Settings.equipment_key = window.localStorage.getItem('equipment_key') || '1'
    Settings.prayer_key = window.localStorage.getItem('prayer_key') || '3'
  }
}
