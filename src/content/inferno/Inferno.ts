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
import { Region } from '../../sdk/Region'
import { Game } from '../../sdk/Game'
import { Settings } from '../../sdk/Settings'

export class Inferno extends Region {
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
  
  initialize (game: Game) {
    this.initializeMap();

    // Add pillars
    Pillar.addPillarsToGame(game)
    const wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62

    // Add player
    const player = new Player(
      game,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 17, y: parseInt(BrowserUtils.getQueryVar('y')) || 3 },
      { weapon: new TwistedBow() })
    game.setPlayer(player)

    // Add mobs

    const bat = BrowserUtils.getQueryVar('bat')
    const blob = BrowserUtils.getQueryVar('blob')
    const melee = BrowserUtils.getQueryVar('melee')
    const ranger = BrowserUtils.getQueryVar('ranger')
    const mager = BrowserUtils.getQueryVar('mager')
    const randomPillar = shuffle(game.entities)[0]
    const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
    const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;

    if (bat || blob || melee || ranger || mager) {
      // Backwards compatibility layer for runelite plugin
      game.wave = 'imported';

      (JSON.parse(mager) || []).forEach((spawn: number[]) => game.addMob(new Mager(game, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(ranger) || []).forEach((spawn: number[]) => game.addMob(new Ranger(game, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(melee) || []).forEach((spawn: number[]) => game.addMob(new Meleer(game, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(blob) || []).forEach((spawn: number[]) => game.addMob(new Blob(game, { x: spawn[0], y: spawn[1] }, { aggro: player })));
      (JSON.parse(bat) || []).forEach((spawn: number[]) => game.addMob(new Bat(game, { x: spawn[0], y: spawn[1] }, { aggro: player })))

      Waves.spawnNibblers(3, game, randomPillar).forEach(game.addMob.bind(game))

      replayLink.href = `/${window.location.search}`

    } else {
      // Native approach
      const spawns = BrowserUtils.getQueryVar('spawns') ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar('spawns'))) : Waves.getRandomSpawns()

      Waves.spawn(game, randomPillar, spawns, wave).forEach(game.addMob.bind(game))
      game.wave = String(wave)

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

  drawGameBackground(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.gridCanvas, 0, 0);
  }
}
