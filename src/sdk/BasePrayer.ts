'use strict'

import { Player } from "./Player";
import { ImageLoader } from "./utils/ImageLoader";

export enum PrayerGroups {
  OVERHEADS = 'overheads',
  DEFENCE = 'defence',
  STRENGTH ='strength',
  ACCURACY = 'accuracy',
  RANGE = 'range',
  HEARTS = 'hearts',
  PROTECTITEM = 'protectitem',
  PRESERVE = 'preserve',
}

export class BasePrayer {

  lastActivated = 0;
  isActive = false;
  cachedImage: HTMLImageElement;

  constructor () {
    this.deactivate()
  }

  levelRequirement(): number {
    return 99;
  }

  feature (): string {
    return ''
  }

  drainRate(): number {
    throw new Error('prayer does not have proper drain rate');
    
  }

  get name () {
    return 'Protect from Magic'
  }

  get groups (): PrayerGroups[] {
    return []
  }
  
  activate (player: Player) {
    if (player.stats.prayer < this.levelRequirement()){
      return;
    }
    
    this.lastActivated = Date.now();
  }

  toggle(player: Player) {

    if (player.stats.prayer < this.levelRequirement()){
      return;
    }
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.lastActivated = Date.now();
    }
  }

  deactivate () {
    // 
  }

  isOverhead () {
    return false
  }

  overheadImageReference (): string {
    return ''
  }

  overheadImage () {
    if (!this.cachedImage && this.overheadImageReference()) {
      this.cachedImage = ImageLoader.createImage(this.overheadImageReference())
      return null;
    }

    return this.cachedImage
  }

  playOffSound() {
    // Override me
  }
  playOnSound() {
    // Override me
  }
}
