'use strict'

import InfernoMapImage from '../assets/images/map.png'


import { Region } from '../../../sdk/Region'
import { Settings } from '../../../sdk/Settings'
import { ImageLoader } from '../../../sdk/utils/ImageLoader'
import { Viewport } from '../../../sdk/Viewport'
import { JalAk } from './mobs/JalAk'
import { JalImKot } from './mobs/JalImKot'
import { JalMejRah } from './mobs/JalMejRah'
import { JalXil } from './mobs/JalXil'
import { JalZek } from './mobs/JalZek'

/* eslint-disable @typescript-eslint/no-explicit-any */

export class InfernoRegion extends Region {


  wave: number;
  mapImage: HTMLImageElement = ImageLoader.createImage(InfernoMapImage)
  
  getName() {
    return 'Inferno'
  }

  get width(): number {
    return 51
  }

  get height(): number {
    return 57
  }

  rightClickActions(): any[] {

    if (this.wave !== 0) {
      return [];
    }

    return [

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: 'Bat', fillStyle: 'blue' }],
        action: () => {
          Viewport.viewport.clickController.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalMejRah(this, { x, y }, { aggro: Viewport.viewport.player });
          mob.removableWithRightClick = true;
          this.addMob(mob)

        }
      },

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: 'Blob', fillStyle: 'green' }],
        action: () => {
          Viewport.viewport.clickController.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalAk(this, { x, y }, { aggro: Viewport.viewport.player });
          mob.removableWithRightClick = true;
          this.addMob(mob)
        }
      },

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: 'Meleer', fillStyle: 'yellow' }],
        action: () => {
          Viewport.viewport.clickController.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalImKot(this, { x, y }, { aggro: Viewport.viewport.player });
          mob.removableWithRightClick = true;
          this.addMob(mob)
        }
      },

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: 'Ranger', fillStyle: 'orange' }],
        action: () => {
          Viewport.viewport.clickController.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalXil(this, { x, y }, { aggro: Viewport.viewport.player });
          mob.removableWithRightClick = true;
          this.addMob(mob)
        }
      },

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: 'Mager', fillStyle: 'red' }],
        action: () => {
          Viewport.viewport.clickController.yellowClick()
          const x = Viewport.viewport.contextMenu.destinationLocation.x;
          const y = Viewport.viewport.contextMenu.destinationLocation.y;
          const mob = new JalZek(this, { x, y }, { aggro: Viewport.viewport.player });
          mob.removableWithRightClick = true;
          this.addMob(mob)
        }
      }
    ];

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

  drawWorldBackground() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, 10000000, 10000000);
    if (this.mapImage) {
      const ctx = this.context as any;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;

      this.context.drawImage(this.mapImage, 0, 0, this.width * Settings.tileSize, this.height * Settings.tileSize)

      ctx.webkitImageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      this.context.imageSmoothingEnabled = true;

    }
  }
}
