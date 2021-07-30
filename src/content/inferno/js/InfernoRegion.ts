'use strict'

import { shuffle } from 'lodash'

import { InfernoPillar } from './InfernoPillar'
import { Player } from '../../../sdk/Player'
import { InfernoWaves } from './InfernoWaves'
import { JalZek } from './mobs/JalZek'
import { JalXil } from './mobs/JalXil'
import { JalImKot } from './mobs/JalImKot'
import { JalAk } from './mobs/JalAk'
import { TzKalZuk } from './mobs/TzKalZuk'
import { JalMejRah } from './mobs/JalMejRah'
import { BrowserUtils } from '../../../sdk/utils/BrowserUtils'
import { TwistedBow } from '../../weapons/TwistedBow'
import { Blowpipe } from '../../weapons/Blowpipe'
import { Region } from '../../../sdk/Region'
import { World } from '../../../sdk/World'
import { Settings } from '../../../sdk/Settings'
import InfernoMapImage from '../assets/images/map.png'
import { ImageLoader } from '../../../sdk/utils/ImageLoader'
import { JusticiarFaceguard } from '../../equipment/JusticiarFaceguard';
import { NecklaceOfAnguish } from '../../equipment/NecklaceOfAnguish';
import { ArmadylChestplate } from '../../equipment/ArmadylChestplate';
import { ArmadylChainskirt } from '../../equipment/ArmadylChainskirt';
import { PegasianBoots } from '../../equipment/PegasianBoots';
import { AvasAssembler } from '../../equipment/AvasAssembler';
import { HolyBlessing } from '../../equipment/HolyBlessing';
import { BarrowsGloves } from '../../equipment/BarrowsGloves';
import { RingOfSufferingImbued } from '../../equipment/RingOfSufferingImbued';
import { RingOfEndurance } from '../../equipment/RingOfEndurance';
import { CrystalShield } from '../../equipment/CrystalShield';
import { JusticiarChestguard } from '../../equipment/JusticiarChestguard'
import { JusticiarLegguards } from '../../equipment/JusticiarLegguards'
import { KodaiWand } from '../../weapons/KodaiWand'
import { DevoutBoots } from '../../equipment/DevoutBoots'
import { AncestralRobetop } from '../../equipment/AncestralRobetop'
import { AncestralRobebottom } from '../../equipment/AncestralRobebottom'
import { StaminaPotion } from '../../items/StaminaPotion'
import { SaradominBrew } from '../../items/SaradominBrew'
import { SuperRestore } from '../../items/SuperRestore'
import { BastionPotion } from '../../items/BastionPotion'
import { MovementBlocker } from '../../MovementBlocker'
import { ZukShield } from "./ZukShield"

export class InfernoRegion extends Region {

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
  
  getInventory () {
    return [
      new TwistedBow(), new JusticiarChestguard(), new JusticiarLegguards(), new KodaiWand(),
      new CrystalShield(), new DevoutBoots(), new AncestralRobetop(), new AncestralRobebottom(),
      new RingOfEndurance(), new StaminaPotion(), new SaradominBrew(), new SaradominBrew(),
      new SaradominBrew(), new SaradominBrew(), new SaradominBrew(), new SaradominBrew(),
      new SuperRestore(), new SuperRestore(), new SuperRestore(), new SuperRestore(), 
      new SuperRestore(), new SuperRestore(), new SuperRestore(), new SuperRestore(), 
      new SuperRestore(), new SuperRestore(), new SuperRestore(), new BastionPotion(), 
    ]
  }

  initialize (world: World) {


    let wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62


    // Add player
    const player = new Player(
      world,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 25, y: parseInt(BrowserUtils.getQueryVar('y')) || 15 },
      { equipment: { 
          weapon: new Blowpipe(),
          helmet: new JusticiarFaceguard(),
          necklace: new NecklaceOfAnguish(),
          cape: new AvasAssembler(),
          ammo: new HolyBlessing(),
          chest: new ArmadylChestplate(),
          legs: new ArmadylChainskirt(),
          feet: new PegasianBoots(),
          gloves: new BarrowsGloves(),
          ring: new RingOfSufferingImbued(), 
        }
      })
    world.setPlayer(player)



    if (wave !== 69) {
      // Add pillars
      InfernoPillar.addPillarsToWorld(world)
      if (isNaN(wave)){
        wave = 1;
      }  
      
    }

    const randomPillar = (shuffle(world.entities) || [null])[0] // Since we've only added pillars this is safe. Do not move to after movement blockers.


    for (let x = 10;x < 41;x++) {
      world.addEntity(new MovementBlocker(world, { x, y: 13}))
      world.addEntity(new MovementBlocker(world, { x, y: 44}))
    }
    for (let y = 14;y < 44;y++) {
      world.addEntity(new MovementBlocker(world, { x: 10, y}))
      world.addEntity(new MovementBlocker(world, { x: 40, y}))
    }
    const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;


    // Add mobs
    if (wave !== 69) {
      const bat = BrowserUtils.getQueryVar('bat') || '[]'
      const blob = BrowserUtils.getQueryVar('blob') || '[]'
      const melee = BrowserUtils.getQueryVar('melee') || '[]'
      const ranger = BrowserUtils.getQueryVar('ranger') || '[]'
      const mager = BrowserUtils.getQueryVar('mager') || '[]'
      const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
  
      // world.addMob(new JalMejRah(world, {x: 0, y: 0}, { aggro: player}))
      
      if (bat != '[]' || blob != '[]' || melee != '[]' || ranger != '[]' || mager != '[]') {
        // Backwards compatibility layer for runelite plugin
        world.wave = 'imported';
        try {
          JSON.parse(mager).forEach((spawn: number[]) => world.addMob(new JalZek(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(ranger).forEach((spawn: number[]) => world.addMob(new JalXil(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(melee).forEach((spawn: number[]) => world.addMob(new JalImKot(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(blob).forEach((spawn: number[]) => world.addMob(new JalAk(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })));
          JSON.parse(bat).forEach((spawn: number[]) => world.addMob(new JalMejRah(world, { x: spawn[0] + 11, y: spawn[1] + 14 }, { aggro: player })))
  
          InfernoWaves.spawnNibblers(3, world, randomPillar).forEach(world.addMob.bind(world))
  
          replayLink.href = `/${window.location.search}`
        } catch(ex){
          console.log('failed to import wave from inferno stats');
           
        }
  
      } else {
        // Native approach
        const spawns = BrowserUtils.getQueryVar('spawns') ? JSON.parse(decodeURIComponent(BrowserUtils.getQueryVar('spawns'))) : InfernoWaves.getRandomSpawns()
  
        InfernoWaves.spawn(world, randomPillar, spawns, wave).forEach(world.addMob.bind(world))
        world.wave = String(wave)
  
        const encodedSpawn = encodeURIComponent(JSON.stringify(spawns))
        replayLink.href = `/?wave=${wave}&x=${player.location.x}&y=${player.location.y}&spawns=${encodedSpawn}`
        waveInput.value = String(wave);
      }
    }else {
      // spawn zuk
      world.addMob(new TzKalZuk(world, { x: 22, y: 7}, { aggro: player}))
      world.addEntity(new ZukShield(world, { x: 24, y: 12}))
    }

    /// /////////////////////////////////////////////////////////
    // UI controls

    document.getElementById('playWaveNum').addEventListener('click', () => {
      window.location.href = `/?wave=${waveInput.value || wave}`
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