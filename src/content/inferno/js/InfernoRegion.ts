'use strict'

import InfernoMapImage from '../assets/images/map.png'


import { Region } from '../../../sdk/Region'
import { Settings } from '../../../sdk/Settings'
import { ImageLoader } from '../../../sdk/utils/ImageLoader'

/* eslint-disable @typescript-eslint/no-explicit-any */

export class InfernoRegion extends Region {


  score = 0;
  finalScore = -1;
  wave: number;
  mapImage: HTMLImageElement = ImageLoader.createImage(InfernoMapImage)
  getName () {
    return 'Inferno'
  }

  get width (): number {
    return 51
  }

  get height (): number {
    return 57
  }

  initializeAndGetLoadoutType() { 
    const loadoutSelector = document.getElementById("loadouts") as HTMLInputElement;
    loadoutSelector.value = Settings.loadout;
    loadoutSelector.addEventListener('change', () => {
      Settings.loadout = loadoutSelector.value;
      Settings.persistToStorage();
    })

    return loadoutSelector.value;
  }

  initializeAndGetOnTask() {
    const onTaskCheckbox = document.getElementById("onTask") as HTMLInputElement;
    onTaskCheckbox.checked = Settings.onTask;
    onTaskCheckbox.addEventListener('change', () => {
      Settings.onTask = onTaskCheckbox.checked;
      Settings.persistToStorage();
    })
    return onTaskCheckbox.checked;

  }

  drawWorldBackground(ctx: any) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 10000000, 10000000);
    if (this.mapImage){
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(this.mapImage, 0, 0, this.width * Settings.tileSize, this.height * Settings.tileSize)

      ctx.webkitImageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      ctx.imageSmoothingEnabled = true;

    }
  }
}
