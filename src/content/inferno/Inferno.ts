'use strict'

import { shuffle } from 'lodash'

import { Pillar } from './js/Pillar'
import { Player } from '../../sdk/Player'
import { Waves } from './js/Waves'
import { Mager } from './js/mobs/Mager'
import { Ranger } from './js/mobs/Ranger'
import { Meleer } from './js/mobs/Meleer'
import { Blob } from './js/mobs/Blob'
import { Bat } from './js/mobs/Bat'
import { BrowserUtils } from '../../sdk/Utils/BrowserUtils'
import { TwistedBow } from '../weapons/TwistedBow'
import { Blowpipe } from '../weapons/Blowpipe'
import { Scenario } from '../../sdk/Scenario'
import { Region } from '../../sdk/Region'
import { Settings } from '../../sdk/Settings'

export class Inferno extends Scenario {
  gridCanvas: OffscreenCanvas;

  getName () {
    return 'Inferno'
  }

  getInventory () {
    return [new Blowpipe()]
  }

  initializeMap() {
    this.gridCanvas = new OffscreenCanvas(this.width * Settings.tileSize, this.height * Settings.tileSize)
    const gridContext = this.gridCanvas.getContext('2d')
    gridContext.fillRect(0, 0, this.width * Settings.tileSize, this.height * Settings.tileSize)
    for (let i = 0; i < this.width * this.height; i++) {
      gridContext.fillStyle = (i % 2) ? '#100' : '#210'
      gridContext.fillRect(
        i % this.width * Settings.tileSize,
        Math.floor(i / this.width) * Settings.tileSize,
        Settings.tileSize,
        Settings.tileSize
      )
    }
  }
  
  initialize (region: Region) {
    this.initializeMap();

    // Add pillars
    Pillar.addPillarsToRegion(region)
    const wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62

    // Add player
    const player = new Player(
      region,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 17, y: parseInt(BrowserUtils.getQueryVar('y')) || 3 },
      { weapon: new TwistedBow() })
    region.setPlayer(player)

    // Add mobs

    const bat = BrowserUtils.getQueryVar('bat')
    const blob = BrowserUtils.getQueryVar('blob')
    const melee = BrowserUtils.getQueryVar('melee')
    const ranger = BrowserUtils.getQueryVar('ranger')
    const mager = BrowserUtils.getQueryVar('mager')
    const randomPillar = shuffle(region.entities)[0]
    const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
    const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;

    if (bat || blob || melee || ranger || mager) {
      // Backwards compatibility layer for runelite plugin
      region.wave = 'imported';

      (JSON.parse(mager) || []).forEach((spawn: number[]) => region.addMob(new Mager(region, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(ranger) || []).forEach((spawn: number[]) => region.addMob(new Ranger(region, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(melee) || []).forEach((spawn: number[]) => region.addMob(new Meleer(region, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(blob) || []).forEach((spawn: number[]) => region.addMob(new Blob(region, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(bat) || []).forEach((spawn: number[]) => region.addMob(new Bat(region, { x: spawn[0], y: spawn[1] }, { aggro: player })))

      Waves.spawnNibblers(3, region, randomPillar).forEach(region.addMob.bind(region))

      replayLink.href = `/${window.location.search}`

    } else {
      // Native approach
      const spawns = BrowserUtils.getQueryVar('spawns') ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar('spawns'))) : Waves.getRandomSpawns()

      Waves.spawn(region, randomPillar, spawns, wave).forEach(region.addMob.bind(region))
      region.wave = String(wave)

      const encodedSpawn = encodeURIComponent(JSON.stringify(spawns))
      replayLink.href = `/?wave=${wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`
      waveInput.value = String(wave);
    }
    /// /////////////////////////////////////////////////////////
    // UI controls

    document.getElementById('playWaveNum').addEventListener('click', () => {
      window.location.href = `/?wave=${waveInput.value || wave}`
    })
  }

  drawRegionBackground(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.gridCanvas, 0, 0);
  }
}
