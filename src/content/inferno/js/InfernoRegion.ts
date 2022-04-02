'use strict'

import { filter, shuffle } from 'lodash'
import { InfernoPillar } from './InfernoPillar'
import { Player } from '../../../sdk/Player'
import { InfernoWaves } from './InfernoWaves'
import InfernoMapImage from '../assets/images/map.png'

import { Location } from '../../../sdk/Location'
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
import { Mob } from '../../../sdk/Mob'
import { EntityName } from '../../../sdk/EntityName'

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

  // initialize () {
  //   super.initialize();
    
  //   this.wave = parseInt(BrowserUtils.getQueryVar('wave'));
  //   if (isNaN(this.wave)){
  //     this.wave = 62;
  //   }
  //   if (this.wave < 0) {
  //     this.wave = 0;
  //   }
  //   if (this.wave > InfernoWaves.waves.length + 8) {
  //     this.wave = InfernoWaves.waves.length + 8;
  //   }

  //   if (this.wave < 67 || this.wave >=70) {
  //     // Add pillars
  //     InfernoPillar.addPillarsToWorld(this)
  //   }

  //   const randomPillar = (shuffle(this.entities) || [null])[0] // Since we've only added pillars this is safe. Do not move to after movement blockers.


  //   for (let x = 10;x < 41;x++) {
  //     this.addEntity(new InvisibleMovementBlocker(this, { x, y: 13}))
  //     this.addEntity(new InvisibleMovementBlocker(this, { x, y: 44}))
  //   }
  //   for (let y = 14;y < 44;y++) {
  //     this.addEntity(new InvisibleMovementBlocker(this, { x: 10, y}))
  //     this.addEntity(new InvisibleMovementBlocker(this, { x: 40, y}))
  //   }
  //   const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;

  //   const exportWaveInput: HTMLButtonElement = document.getElementById('exportCustomWave') as HTMLButtonElement;
  //   const editWaveInput: HTMLButtonElement = document.getElementById('editWave') as HTMLButtonElement;


  //   editWaveInput.addEventListener('click', () => {


  //     const magers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_ZEK;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const rangers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_XIL;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const meleers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_IM_KOT;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const blobs = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_AK;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const bats = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_MEJ_RAJ;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });

  //     const url = `/?wave=0&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(rangers)}&melee=${JSON.stringify(meleers)}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`
  //     window.location.href = url;

  //   })
  //   exportWaveInput.addEventListener('click', () => {


  //     const magers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_ZEK;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const rangers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_XIL;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const meleers = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_IM_KOT;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const blobs = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_AK;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });
      
  //     const bats = filter(this.mobs, (mob: Mob) => {
  //       return mob.mobName() === EntityName.JAL_MEJ_RAJ;
  //     }).map((mob: Mob) => {
  //       return [mob.location.x - 11, mob.location.y - 14]
  //     });

  //     const url = `/?wave=74&mager=${JSON.stringify(magers)}&ranger=${JSON.stringify(rangers)}&melee=${JSON.stringify(meleers)}&blob=${JSON.stringify(blobs)}&bat=${JSON.stringify(bats)}&copyable`
  //     window.location.href = url;

  //   })

  //   const bat = BrowserUtils.getQueryVar('bat') || '[]'
  //   const blob = BrowserUtils.getQueryVar('blob') || '[]'
  //   const melee = BrowserUtils.getQueryVar('melee') || '[]'
  //   const ranger = BrowserUtils.getQueryVar('ranger') || '[]'
  //   const mager = BrowserUtils.getQueryVar('mager') || '[]'
  //   const replayLink = document.getElementById('replayLink') as HTMLLinkElement;



  // function importSpawn() {

  //     try {
  //       JSON.parse(mager).forEach((spawn: number[]) => this.addMob(new JalZek(this, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
  //       JSON.parse(ranger).forEach((spawn: number[]) => this.addMob(new JalXil(this, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
  //       JSON.parse(melee).forEach((spawn: number[]) => this.addMob(new JalImKot(this, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
  //       JSON.parse(blob).forEach((spawn: number[]) => this.addMob(new JalAk(this, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
  //       JSON.parse(bat).forEach((spawn: number[]) => this.addMob(new JalMejRah(this, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })))

  //       InfernoWaves.spawnNibblers(3, this, randomPillar).forEach(this.addMob.bind(this))

  //       replayLink.href = `/${window.location.search}`
  //     } catch(ex){
  //       console.log('failed to import wave from inferno stats');
        
  //     }
  // }

  // if (Settings.tile_markers) {
  //   Settings.tile_markers.map((location: Location) => {
  //     return new TileMarker(this, location, "#FF0000")
  //   }).forEach((tileMarker: TileMarker) => {
  //     this.addEntity(tileMarker);
  //   })
  // }

  //   // Add mobs
  //   if (this.wave === 0) {
  //     // world.getReadyTimer = 0;
  //     player.location = { x: 28, y: 17}

      
  //     InfernoWaves.getRandomSpawns().forEach((spawn: Location) => {
  //       [2,3,4].forEach((size: number) => {
  //         const tileMarker = new TileMarker(this, spawn, "#FF730073", size, false)
  //         this.addEntity(tileMarker);
  //       })
  //     });
      
  //     importSpawn();
  //   }else if (this.wave < 67) {
  //     player.location = { x: 28, y: 17}

  //     // this.addMob(new JalMejRah(world, {x: 0, y: 0}, { aggro: player}))
      
  //     if (bat != '[]' || blob != '[]' || melee != '[]' || ranger != '[]' || mager != '[]') {
  //       // Backwards compatibility layer for runelite plugin
  //       this.wave = 1;
        
  //       importSpawn();
  
  //     } else {
  //       // Native approach
  //       const spawns = BrowserUtils.getQueryVar('spawns') ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar('spawns'))) : InfernoWaves.getRandomSpawns()
  
  //       InfernoWaves.spawn(this, player, randomPillar, spawns, this.wave).forEach(this.addMob.bind(this))
  
  //       const encodedSpawn = encodeURIComponent(JSON.stringify(spawns))
  //       replayLink.href = `/?wave=${this.wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`
  //       waveInput.value = String(this.wave);
  //     }
  //   }else if (this.wave === 67){ 
 
  //     player.location = { x: 18, y: 25}
  //     const jad = new JalTokJad(this, { x: 23, y: 27}, { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false });
  //     this.addMob(jad)
  //   }else if (this.wave === 68){ 
  //     player.location = { x: 25, y: 27}

  //     const jad1 = new JalTokJad(this, { x: 18, y: 24}, { aggro: player, attackSpeed: 9, stun: 1, healers: 3, isZukWave: false });
  //     this.addMob(jad1)

  //     const jad2 = new JalTokJad(this, { x: 28, y: 24}, { aggro: player, attackSpeed: 9, stun: 7, healers: 3, isZukWave: false });
  //     this.addMob(jad2)

  //     const jad3 = new JalTokJad(this, { x: 23, y: 35}, { aggro: player, attackSpeed: 9, stun: 4, healers: 3, isZukWave: false });
  //     this.addMob(jad3)
  //   }else if (this.wave === 69){
  //     player.location = { x: 25, y: 15}

  //     // spawn zuk
  //     const shield = new ZukShield(this, { x: 23, y: 13}, {});
  //     this.addMob(shield)

  //     this.addMob(new TzKalZuk(this, { x: 22, y: 8}, { aggro: player }))

  //     this.addEntity(new Wall(this, {x: 21, y: 8}));
  //     this.addEntity(new Wall(this, {x: 21, y: 7}));
  //     this.addEntity(new Wall(this, {x: 21, y: 6}));
  //     this.addEntity(new Wall(this, {x: 21, y: 5}));
  //     this.addEntity(new Wall(this, {x: 21, y: 4}));
  //     this.addEntity(new Wall(this, {x: 21, y: 3}));
  //     this.addEntity(new Wall(this, {x: 21, y: 2}));
  //     this.addEntity(new Wall(this, {x: 21, y: 1}));
  //     this.addEntity(new Wall(this, {x: 21, y: 0}));
  //     this.addEntity(new Wall(this, {x: 29, y: 8}));
  //     this.addEntity(new Wall(this, {x: 29, y: 7}));
  //     this.addEntity(new Wall(this, {x: 29, y: 6}));
  //     this.addEntity(new Wall(this, {x: 29, y: 5}));
  //     this.addEntity(new Wall(this, {x: 29, y: 4}));
  //     this.addEntity(new Wall(this, {x: 29, y: 3}));
  //     this.addEntity(new Wall(this, {x: 29, y: 2}));
  //     this.addEntity(new Wall(this, {x: 29, y: 1}));
  //     this.addEntity(new Wall(this, {x: 29, y: 0}));

  //     this.addEntity(new TileMarker(this, {x: 14, y: 14}, '#00FF00', 1, false));

  //     this.addEntity(new TileMarker(this, {x: 16, y: 14}, '#FF0000', 1, false));
  //     this.addEntity(new TileMarker(this, {x: 17, y: 14}, '#FF0000', 1, false));
  //     this.addEntity(new TileMarker(this, {x: 18, y: 14}, '#FF0000', 1, false));

  //     this.addEntity(new TileMarker(this, {x: 20, y: 14}, '#00FF00', 1, false));
      
  //     this.addEntity(new TileMarker(this, {x: 30, y: 14}, '#00FF00', 1, false));


  //     this.addEntity(new TileMarker(this, {x: 32, y: 14}, '#FF0000', 1, false));
  //     this.addEntity(new TileMarker(this, {x: 33, y: 14}, '#FF0000', 1, false));
  //     this.addEntity(new TileMarker(this, {x: 34, y: 14}, '#FF0000', 1, false));


  //     this.addEntity(new TileMarker(this, {x: 36, y: 14}, '#00FF00', 1, false));

  //   }else if (this.wave === 70){
  //     player.location = { x: 28, y: 17}
  //     InfernoWaves.spawnEnduranceMode(this, player, 3).forEach((mob: Mob) => this.addMob(mob))
  //   }else if (this.wave === 71){
  //     player.location = { x: 28, y: 17}
  //     InfernoWaves.spawnEnduranceMode(this, player,  5).forEach((mob: Mob) => this.addMob(mob))
  //   }else if (this.wave === 72){
  //     player.location = { x: 28, y: 17}
  //     InfernoWaves.spawnEnduranceMode(this, player,  7).forEach((mob: Mob) => this.addMob(mob))
  //   }else if (this.wave === 73){
  //     player.location = { x: 28, y: 17}
  //     InfernoWaves.spawnEnduranceMode(this, player,  9).forEach((mob: Mob) => this.addMob(mob))
  //   }else if (this.wave === 74){
  //     player.location = { x: 28, y: 17}

  //     importSpawn();
  //   }
  //   player.perceivedLocation = player.location
  //   player.destinationLocation = player.location
  //   /// /////////////////////////////////////////////////////////
  //   // UI controls

  //   document.getElementById('playWaveNum').addEventListener('click', () => {
  //     window.location.href = `/?wave=${waveInput.value || this.wave}`
  //   })


  //   // TODO: Restore this
  //   // document.getElementById('pauseResumeLink').addEventListener('click', () => world.isPaused ? world.startTicking(this) : world.stopTicking(this))
  // }

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
