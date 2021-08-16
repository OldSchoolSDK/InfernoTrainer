'use strict'

import { shuffle } from 'lodash'
import { InfernoViewport } from './InfernoViewport'
import { InfernoPillar } from './InfernoPillar'
import { Player } from '../../../sdk/Player'
import { InfernoWaves } from './InfernoWaves'
import { InfernoLoadout } from './InfernoLoadout';
import InfernoMapImage from '../assets/images/map.png'

import { JalZek } from './mobs/JalZek'
import { JalXil } from './mobs/JalXil'
import { JalImKot } from './mobs/JalImKot'
import { JalAk } from './mobs/JalAk'
import { TzKalZuk } from './mobs/TzKalZuk'
import { JalMejRah } from './mobs/JalMejRah'
import { JalTokJad } from './mobs/JalTokJad'
import { ZukShield } from "./ZukShield"

import { BrowserUtils } from '../../../sdk/utils/BrowserUtils'
import { Region } from '../../../sdk/Region'
import { World } from '../../../sdk/World'
import { Settings } from '../../../sdk/Settings'
import { ImageLoader } from '../../../sdk/utils/ImageLoader'

import { InvisibleMovementBlocker } from '../../MovementBlocker'
import { Wall } from '../../Wall'
import { TileMarker } from '../../TileMarker'

export class InfernoRegion extends Region {

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
    loadoutSelector.addEventListener('change', (e: InputEvent) => {
      Settings.loadout = loadoutSelector.value;
      Settings.persistToStorage();
    })

    return loadoutSelector.value;
  }

  initializeAndGetOnTask() {
    const onTaskCheckbox = document.getElementById("onTask") as HTMLInputElement;
    onTaskCheckbox.checked = Settings.onTask;
    onTaskCheckbox.addEventListener('change', (e: InputEvent) => {
      Settings.onTask = onTaskCheckbox.checked;
      Settings.persistToStorage();
    })
    return onTaskCheckbox.checked;

  }

  initialize (world: World) {
    super.initialize(world);
    
    this.wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62
    if (isNaN(this.wave)){
      this.wave = 1;
    }
    if (this.wave < 1) {
      this.wave = 1;
    }
    if (this.wave > InfernoWaves.waves.length + 3) {
      this.wave = InfernoWaves.waves.length + 3;
    }


    const loadoutType = this.initializeAndGetLoadoutType();
    const onTask = this.initializeAndGetOnTask();
    const loadout = new InfernoLoadout(this.wave, loadoutType, onTask);
    
    // fun hack to hijack viewport
    world.viewport.clickController.unload(world);
    world.viewport = new InfernoViewport(world);

    // Add player
    const player = new Player(
      world,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 25, y: parseInt(BrowserUtils.getQueryVar('y')) || 25 },
      loadout.getLoadout()
    )
    loadout.setStats(player);
    world.setPlayer(player)



    if (this.wave < 67) {
      // Add pillars
      InfernoPillar.addPillarsToWorld(world)
    }

    const randomPillar = (shuffle(world.region.entities) || [null])[0] // Since we've only added pillars this is safe. Do not move to after movement blockers.


    for (let x = 10;x < 41;x++) {
      world.region.addEntity(new InvisibleMovementBlocker(world, { x, y: 13}))
      world.region.addEntity(new InvisibleMovementBlocker(world, { x, y: 44}))
    }
    for (let y = 14;y < 44;y++) {
      world.region.addEntity(new InvisibleMovementBlocker(world, { x: 10, y}))
      world.region.addEntity(new InvisibleMovementBlocker(world, { x: 40, y}))
    }
    const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;


    // Add mobs
    if (this.wave < 67) {
      player.location = { x: 28, y: 17}

      const bat = BrowserUtils.getQueryVar('bat') || '[]'
      const blob = BrowserUtils.getQueryVar('blob') || '[]'
      const melee = BrowserUtils.getQueryVar('melee') || '[]'
      const ranger = BrowserUtils.getQueryVar('ranger') || '[]'
      const mager = BrowserUtils.getQueryVar('mager') || '[]'
      const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
  
      // world.region.addMob(new JalMejRah(world, {x: 0, y: 0}, { aggro: player}))
      
      if (bat != '[]' || blob != '[]' || melee != '[]' || ranger != '[]' || mager != '[]') {
        // Backwards compatibility layer for runelite plugin
        this.wave = 1;
        try {
          JSON.parse(mager).forEach((spawn: number[]) => world.region.addMob(new JalZek(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(ranger).forEach((spawn: number[]) => world.region.addMob(new JalXil(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(melee).forEach((spawn: number[]) => world.region.addMob(new JalImKot(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(blob).forEach((spawn: number[]) => world.region.addMob(new JalAk(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(bat).forEach((spawn: number[]) => world.region.addMob(new JalMejRah(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })))
  
          InfernoWaves.spawnNibblers(3, world, randomPillar).forEach(world.region.addMob.bind(world.region))
  
          replayLink.href = `/${window.location.search}`
        } catch(ex){
          console.log('failed to import wave from inferno stats');
           
        }
  
      } else {
        // Native approach
        const spawns = BrowserUtils.getQueryVar('spawns') ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar('spawns'))) : InfernoWaves.getRandomSpawns()
  
        InfernoWaves.spawn(world, randomPillar, spawns, this.wave).forEach(world.region.addMob.bind(world.region))
  
        const encodedSpawn = encodeURIComponent(JSON.stringify(spawns))
        replayLink.href = `/?wave=${this.wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`
        waveInput.value = String(this.wave);
      }
    }else if (this.wave === 67){ 
 
      player.location = { x: 18, y: 25}
      const jad = new JalTokJad(world, { x: 23, y: 27}, { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false });
      world.region.addMob(jad)
    }else if (this.wave === 68){ 
      player.location = { x: 25, y: 27}

      const jad1 = new JalTokJad(world, { x: 18, y: 24}, { aggro: player, attackSpeed: 9, stun: 1, healers: 3, isZukWave: false });
      world.region.addMob(jad1)

      const jad2 = new JalTokJad(world, { x: 28, y: 24}, { aggro: player, attackSpeed: 9, stun: 7, healers: 3, isZukWave: false });
      world.region.addMob(jad2)

      const jad3 = new JalTokJad(world, { x: 23, y: 35}, { aggro: player, attackSpeed: 9, stun: 4, healers: 3, isZukWave: false });
      world.region.addMob(jad3)
    }else if (this.wave === 69){
      player.location = { x: 25, y: 15}

      // spawn zuk
      const shield = new ZukShield(world, { x: 23, y: 13}, {});
      world.region.addMob(shield)

      world.region.addMob(new TzKalZuk(world, { x: 22, y: 8}, { aggro: player }))

      world.region.addEntity(new Wall(world, {x: 21, y: 8}));
      world.region.addEntity(new Wall(world, {x: 21, y: 7}));
      world.region.addEntity(new Wall(world, {x: 21, y: 6}));
      world.region.addEntity(new Wall(world, {x: 21, y: 5}));
      world.region.addEntity(new Wall(world, {x: 21, y: 4}));
      world.region.addEntity(new Wall(world, {x: 21, y: 3}));
      world.region.addEntity(new Wall(world, {x: 21, y: 2}));
      world.region.addEntity(new Wall(world, {x: 21, y: 1}));
      world.region.addEntity(new Wall(world, {x: 21, y: 0}));
      world.region.addEntity(new Wall(world, {x: 29, y: 8}));
      world.region.addEntity(new Wall(world, {x: 29, y: 7}));
      world.region.addEntity(new Wall(world, {x: 29, y: 6}));
      world.region.addEntity(new Wall(world, {x: 29, y: 5}));
      world.region.addEntity(new Wall(world, {x: 29, y: 4}));
      world.region.addEntity(new Wall(world, {x: 29, y: 3}));
      world.region.addEntity(new Wall(world, {x: 29, y: 2}));
      world.region.addEntity(new Wall(world, {x: 29, y: 1}));
      world.region.addEntity(new Wall(world, {x: 29, y: 0}));

      world.region.addEntity(new TileMarker(world, {x: 14, y: 14}, '#00FF00'));

      world.region.addEntity(new TileMarker(world, {x: 16, y: 14}, '#FF0000'));
      world.region.addEntity(new TileMarker(world, {x: 17, y: 14}, '#FF0000'));
      world.region.addEntity(new TileMarker(world, {x: 18, y: 14}, '#FF0000'));

      world.region.addEntity(new TileMarker(world, {x: 20, y: 14}, '#00FF00'));
      
      world.region.addEntity(new TileMarker(world, {x: 30, y: 14}, '#00FF00'));


      world.region.addEntity(new TileMarker(world, {x: 32, y: 14}, '#FF0000'));
      world.region.addEntity(new TileMarker(world, {x: 33, y: 14}, '#FF0000'));
      world.region.addEntity(new TileMarker(world, {x: 34, y: 14}, '#FF0000'));


      world.region.addEntity(new TileMarker(world, {x: 36, y: 14}, '#00FF00'));

    }

    player.perceivedLocation = player.location
    player.destinationLocation = player.location
    /// /////////////////////////////////////////////////////////
    // UI controls

    document.getElementById('playWaveNum').addEventListener('click', () => {
      window.location.href = `/?wave=${waveInput.value || this.wave}`
    })


    document.getElementById('pauseResumeLink').addEventListener('click', () => world.isPaused ? world.startTicking() : world.stopTicking())
  }

  drawWorldBackground(ctx: any) {
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
