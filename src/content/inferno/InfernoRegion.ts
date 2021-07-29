'use strict'

import { shuffle } from 'lodash'

import { InfernoPillar } from './js/InfernoPillar'
import { Player } from '../../sdk/Player'
import { InfernoWaves } from './js/InfernoWaves'
import { JalZek } from './js/mobs/JalZek'
import { JalXil } from './js/mobs/JalXil'
import { JalImKot } from './js/mobs/JalImKot'
import { JalAk } from './js/mobs/JalAk'
import { JalMejRah } from './js/mobs/JalMejRah'
import { BrowserUtils } from '../../sdk/utils/BrowserUtils'
import { TwistedBow } from '../weapons/TwistedBow'
import { Blowpipe } from '../weapons/Blowpipe'
import { Region } from '../../sdk/Region'
import { World } from '../../sdk/World'
import { Settings } from '../../sdk/Settings'
import InfernoMapImage from './assets/images/map.png'
import { ImageLoader } from '../../sdk/utils/ImageLoader'
import { JusticiarFaceguard } from '../equipment/JusticiarFaceguard';
import { NecklaceOfAnguish } from '../equipment/NecklaceOfAnguish';
import { ArmadylChestplate } from '../equipment/ArmadylChestplate';
import { ArmadylChainskirt } from '../equipment/ArmadylChainskirt';
import { PegasianBoots } from '../equipment/PegasianBoots';
import { AvasAssembler } from '../equipment/AvasAssembler';
import { HolyBlessing } from '../equipment/HolyBlessing';
import { BarrowsGloves } from '../equipment/BarrowsGloves';
import { RingOfSufferingImbued } from '../equipment/RingOfSufferingImbued';
import { RingOfEndurance } from '../equipment/RingOfEndurance';
import { CrystalShield } from '../equipment/CrystalShield';
import { JusticiarChestguard } from '../equipment/JusticiarChestguard'
import { JusticiarLegguards } from '../equipment/JusticiarLegguards'
import { KodaiWand } from '../weapons/KodaiWand'
import { DevoutBoots } from '../equipment/DevoutBoots'
import { AncestralRobetop } from '../equipment/AncestralRobetop'
import { AncestralRobebottom } from '../equipment/AncestralRobebottom'
import { StaminaPotion } from '../items/StaminaPotion'
import { SaradominBrew } from '../items/SaradominBrew'
export class InfernoRegion extends Region {

  mapImage: HTMLImageElement = ImageLoader.createImage(InfernoMapImage)
  getName () {
    return 'Inferno'
  }

  getInventory () {
    return [
      new TwistedBow(), new JusticiarChestguard(), new JusticiarLegguards(), new KodaiWand(),
      new CrystalShield(), new DevoutBoots(), new AncestralRobetop(), new AncestralRobebottom(),
      new RingOfEndurance(), new StaminaPotion(), new SaradominBrew(), new SaradominBrew(),
      new SaradominBrew(),new SaradominBrew(),new SaradominBrew(),new SaradominBrew(),
    ]
  }

  initialize (world: World) {

    // Add pillars
    InfernoPillar.addPillarsToWorld(world)
    let wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62
    if (isNaN(wave)){
      wave = 1;
    }
    

    // Add player
    const player = new Player(
      world,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 17, y: parseInt(BrowserUtils.getQueryVar('y')) || 3 },
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

    // Add mobs

    const bat = BrowserUtils.getQueryVar('bat') || '[]'
    const blob = BrowserUtils.getQueryVar('blob') || '[]'
    const melee = BrowserUtils.getQueryVar('melee') || '[]'
    const ranger = BrowserUtils.getQueryVar('ranger') || '[]'
    const mager = BrowserUtils.getQueryVar('mager') || '[]'
    const randomPillar = shuffle(world.entities)[0]
    const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
    const waveInput: HTMLInputElement = document.getElementById('waveinput') as HTMLInputElement;

    if (bat != '[]' || blob != '[]' || melee != '[]' || ranger != '[]' || mager != '[]') {
      // Backwards compatibility layer for runelite plugin
      world.wave = 'imported';
      try {
        JSON.parse(mager).forEach((spawn: number[]) => world.addMob(new JalZek(world, { x: spawn[0], y: spawn[1] }, { aggro: player })));
        JSON.parse(ranger).forEach((spawn: number[]) => world.addMob(new JalXil(world, { x: spawn[0], y: spawn[1] }, { aggro: player })));
        JSON.parse(melee).forEach((spawn: number[]) => world.addMob(new JalImKot(world, { x: spawn[0], y: spawn[1] }, { aggro: player })));
        JSON.parse(blob).forEach((spawn: number[]) => world.addMob(new JalAk(world, { x: spawn[0], y: spawn[1] }, { aggro: player })));
        JSON.parse(bat).forEach((spawn: number[]) => world.addMob(new JalMejRah(world, { x: spawn[0], y: spawn[1] }, { aggro: player })))

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
