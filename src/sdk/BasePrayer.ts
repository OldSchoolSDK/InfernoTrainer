"use strict";

import { Player } from "./Player";
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
  isActive = false;
  isLit = false;
  cachedImage: HTMLImageElement;

  constructor() {
    this.deactivate();
  }

  levelRequirement(): number {
    return 99;
  }

  tick() {
    if (this.isLit && !this.isActive) {
      this.isActive = true;
      this.isLit = true;
    } else if (!this.isLit && this.isActive) {
      this.isActive = false;
      this.isLit = false;
    }
  }

  feature(): string {
    return "";
  }

  drainRate(): number {
    throw new Error("prayer does not have proper drain rate");
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
