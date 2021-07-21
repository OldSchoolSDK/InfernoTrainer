'use strict'

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

  get name () {
    return 'Protect from Magic'
  }

  get groups (): PrayerGroups[] {
    return []
  }

  activate () {
    this.isActive = !this.isActive
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
      this.cachedImage = new Image(34, 34)
      this.cachedImage.src = this.overheadImageReference()
    }

    return this.cachedImage
  }

  playOffSound() {

  }
  playOnSound() {

  }
}
