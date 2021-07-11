'use strict';

export default class BasePrayer {

  constructor() {
    this.deactivate();
  }
  
  get name() {
    return 'Protect from Magic';
  }

  get groups(){
    return [];
  }

  activate() {
    this.isActive = !this.isActive;
  }

  deactivate() {
    this.isActive = false;
  }

  isOverhead() {
    return false;
  }

  overheadImageReference() {
    return null;
  }

  overheadImage() {
    if (!this.cachedImage && this.overheadImageReference()){
      this.cachedImage = new Image(34, 34);
      this.cachedImage.src = this.overheadImageReference();
    }

    return this.cachedImage;
  }
  
}
