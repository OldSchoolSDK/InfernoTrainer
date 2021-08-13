'use strict'

import { ImageLoader } from "./utils/ImageLoader";

export enum PrayerGroups {
  OVERHEADS = 'overheads',
  DEFENCE = 'defence',
  STRENGTH ='strength',
  ATTACK = 'attack',
  MAGIC = 'magic',
  RANGE = 'range',
  HEARTS = 'hearts',
  PROTECTITEM = 'protectitem',
  PRESERVE = 'preserve',
}

export class BasePrayer {

  nextActiveState: number = -1;
  isActive: boolean;
  cachedImage: HTMLImageElement;

  constructor () {
    this.deactivate()
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

  tick() {
    if (this.nextActiveState === 1){
      this.isActive = true;
    }else if (this.nextActiveState === 0){
      this.isActive = false;
    }
  }

  activate () {
    this.nextActiveState = 1;
  }

  toggle() {
    if (this.nextActiveState === 0) {
      this.nextActiveState = 1;
    }else{
      this.nextActiveState = 0;
    }
  }

  deactivate () {
    this.nextActiveState = 0
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

  }
  playOnSound() {

  }
}
