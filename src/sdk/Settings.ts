"use strict";

import { PlayerStats, SerializePlayerStats, DeserializePlayerStats } from "./PlayerStats";
import { Location } from "./Location";

export class Settings {
  static zoomScale = 1;

  static _tileSize: number;
  static get tileSize() {
    return Settings._tileSize * Settings.zoomScale;
  }

  static fps = 50;
  static tickMs = 600;
  static playsAudio: boolean;
  static playsAreaAudio: boolean;
  static inputDelay: number;
  static rotated: string;
  static region: string;
  static displayXpDrops: boolean;
  static lockPOV: boolean;
  static displayFeedback: boolean;
  static metronome: boolean;

  static inventory_key: string;
  static spellbook_key: string;
  static equipment_key: string;
  static prayer_key: string;
  static combat_key: string;
  static tile_markers: Location[];

  static loadout: string;
  static onTask: boolean;
  static player_stats: PlayerStats;
  static is_keybinding = false;
  static southPillar = true;
  static westPillar = true;
  static northPillar = true;

  static displayPlayerLoS = false;
  static displayMobLoS = false;
  static menuVisible: boolean;

  static minimapScale: number;
  static controlPanelScale: number;

  static maxUiScale: number;

  static _isMobileResult = null;

  static use3dView = true;

  static mobileCheck() {
    if (Settings._isMobileResult !== null) {
      return Settings._isMobileResult;
    }
    Settings._isMobileResult = /Mobi/.test(navigator.userAgent);
    return Settings._isMobileResult;
  }

  static persistToStorage() {
    // window.localStorage.setItem('tileSize', Settings.tileSize);
    // window.localStorage.setItem('framesPerTick', Settings.framesPerTick);
    window.localStorage.setItem("zoomScale", String(Settings.zoomScale));
    window.localStorage.setItem("playsAudio", String(Settings.playsAudio));
    window.localStorage.setItem("playsAreaAudio", String(Settings.playsAreaAudio));
    window.localStorage.setItem("inputDelay", String(Settings.inputDelay));
    window.localStorage.setItem("rotated", Settings.rotated);
    window.localStorage.setItem("region", Settings.region);
    window.localStorage.setItem("displayXpDrops", String(Settings.displayXpDrops));

    window.localStorage.setItem("inventory_key", Settings.inventory_key);
    window.localStorage.setItem("spellbook_key", Settings.spellbook_key);
    window.localStorage.setItem("equipment_key", Settings.equipment_key);
    window.localStorage.setItem("prayer_key", Settings.prayer_key);
    window.localStorage.setItem("combat_key", Settings.combat_key);
    window.localStorage.setItem("stats", SerializePlayerStats(Settings.player_stats));
    window.localStorage.setItem("loadout", Settings.loadout);
    window.localStorage.setItem("onTask", String(Settings.onTask));
    window.localStorage.setItem("southPillar", String(Settings.southPillar));
    window.localStorage.setItem("westPillar", String(Settings.westPillar));
    window.localStorage.setItem("northPillar", String(Settings.northPillar));
    window.localStorage.setItem("displayPlayerLoS", String(Settings.displayPlayerLoS));
    window.localStorage.setItem("displayMobLoS", String(Settings.displayMobLoS));
    window.localStorage.setItem("metronome", String(Settings.metronome));
    window.localStorage.setItem("displayFeedback", String(Settings.displayFeedback));
    window.localStorage.setItem("tile_markers", JSON.stringify(Settings.tile_markers));
    window.localStorage.setItem("lockPOV", JSON.stringify(Settings.lockPOV));
    window.localStorage.setItem("menuVisible", String(Settings.menuVisible));
    window.localStorage.setItem("use3dView", String(Settings.use3dView));
    window.localStorage.setItem("maxUiScale", String(Settings.maxUiScale));
  }

  static readFromStorage() {
    Settings.minimapScale = Settings.mobileCheck() ? 0.65 : 1;
    Settings.controlPanelScale = Settings.mobileCheck() ? 0.9 : 1.5;

    Settings.zoomScale = parseFloat(window.localStorage.getItem("zoomScale")) || 1;

    Settings.playsAudio = window.localStorage.getItem("playsAudio") === "true" || false;
    Settings.playsAreaAudio = window.localStorage.getItem("playsAreaAudio") === "true" || false;

    if (Settings.mobileCheck()) {
      Settings.playsAudio = false;
      Settings.playsAreaAudio = false;
    }
    // Settings.tileSize = parseInt(window.localStorage.getItem('tileSize')) || 23;
    // Settings.framesPerTick = parseInt(window.localStorage.getItem('framesPerTick')) || 30;
    Settings.inputDelay = parseInt(window.localStorage.getItem("inputDelay")) || 100;
    Settings.rotated = window.localStorage.getItem("rotated") || "south";
    Settings.loadout = window.localStorage.getItem("loadout") || "max_tbow_speed";
    Settings.onTask = window.localStorage.getItem("onTask") === "true" || false;
    Settings.southPillar = window.localStorage.getItem("southPillar") !== "false" || false;
    Settings.westPillar = window.localStorage.getItem("westPillar") !== "false" || false;
    Settings.northPillar = window.localStorage.getItem("northPillar") !== "false" || false;
    Settings.displayPlayerLoS = window.localStorage.getItem("displayPlayerLoS") === "true" || false;
    Settings.displayMobLoS = window.localStorage.getItem("displayMobLoS") === "true" || false;
    Settings.lockPOV = false; //window.localStorage.getItem('lockPOV') !== 'false' || false;
    Settings.displayFeedback = !(window.localStorage.getItem("displayFeedback") === "false" || false);
    Settings.metronome = window.localStorage.getItem("metronome") === "true" || false;

    Settings.region = "inferno";
    Settings.displayXpDrops = !(window.localStorage.getItem("displayXpDrops") === "false" || false);

    Settings.inventory_key = window.localStorage.getItem("inventory_key") || "F4";
    Settings.spellbook_key = window.localStorage.getItem("spellbook_key") || "F2";
    Settings.equipment_key = window.localStorage.getItem("equipment_key") || "F1";
    Settings.prayer_key = window.localStorage.getItem("prayer_key") || "F3";
    Settings.combat_key = window.localStorage.getItem("combat_key") || "F5";
    Settings.player_stats = DeserializePlayerStats(window.localStorage.getItem("stats"));
    Settings.tile_markers = JSON.parse(window.localStorage.getItem("tile_markers"));

    if (window.localStorage.getItem("menuVisible") === "true") {
      Settings.menuVisible = true;
    } else if (window.localStorage.getItem("menuVisible") === "false") {
      Settings.menuVisible = false;
    } else {
      Settings.menuVisible = Settings.mobileCheck() === false;
    }
    if (!Settings.menuVisible) {
      document.getElementById("right_panel").classList.add("hidden");
    }
    Settings.use3dView = window.localStorage.getItem("use3dView") !== "false" || false;
    if (Settings.use3dView) {
      Settings.rotated = "north";
    }
    Settings.maxUiScale = parseFloat(window.localStorage.getItem("maxUiScale")) || 1.0;
  }
}
