"use strict";

import { Player } from "./Player";
import { Settings } from "./Settings";
import { ImageLoader } from "./utils/ImageLoader";

export enum PrayerGroups {
  OVERHEADS = "overheads",
  DEFENCE = "defence",
  STRENGTH = "strength",
  ACCURACY = "accuracy",
  RANGE = "range",
  HEARTS = "hearts",
  PROTECTITEM = "protectitem",
  PRESERVE = "preserve",
}

export class BasePrayer {
  lastActivated = 0;
  private lastDeactivated = 0;
  // server-side
  isActive = false;
  // client-side
  isLit = false;
  cachedImage: HTMLImageElement;

  constructor() {
    this.deactivate();
  }

  levelRequirement(): number {
    return 99;
  }

  tick() {
    const ping = Settings.inputDelay || 0;
    const now = Date.now();
    if (this.isLit && !this.isActive) {
      if (now >= this.lastActivated + ping) {
        this.isActive = true;
      }
      this.isLit = true;
    } else if (!this.isLit && this.isActive) {
      if (now >= this.lastDeactivated + ping) {
        this.isActive = false;
      }
      this.isLit = false;
    }
  }

  drainRate(): number {
    throw new Error("prayer does not have proper drain rate");
  }

  // currently only used for overheads
  feature(): string {
    return "";
  }

  get name() {
    return "Protect from Magic";
  }

  get groups(): PrayerGroups[] {
    return [];
  }

  activate(player: Player) {
    if (player.stats.prayer < this.levelRequirement()) {
      return;
    }
    this.lastActivated = Date.now();
    this.isLit = true;
  }

  toggle(player: Player) {
    if (player.stats.prayer < this.levelRequirement()) {
      return;
    }
    this.isLit = !this.isLit;
    if (this.isLit) {
      this.lastActivated = Date.now();
    } else {
      this.lastDeactivated = Date.now();
    }
  }

  deactivate() {
    this.isLit = false;
  }

  isOverhead() {
    return false;
  }

  overheadImageReference(): string {
    return "";
  }

  overheadImage() {
    if (!this.cachedImage && this.overheadImageReference()) {
      this.cachedImage = ImageLoader.createImage(this.overheadImageReference());
      return null;
    }

    return this.cachedImage;
  }

  playOffSound() {
    // Override me
  }
  playOnSound() {
    // Override me
  }
}
