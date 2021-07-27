'use strict'

import { ImageLoader } from "./Utils/ImageLoader";

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

  activate () {
    this.isActive = true;
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  deactivate () {
    this.isActive = false
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
