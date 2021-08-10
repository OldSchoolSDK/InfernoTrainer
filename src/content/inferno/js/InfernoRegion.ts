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
import { JalTokJad } from './mobs/JalTokJad'
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
import { Shark } from '../../items/Shark'
import { Karambwan } from '../../items/Karambwan'
import { BastionPotion } from '../../items/BastionPotion'
import { MovementBlocker } from '../../MovementBlocker'
import { Wall } from '../../Wall'
import { TileMarker } from '../../TileMarker'
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
      new Blowpipe(), new JusticiarChestguard(), new JusticiarLegguards(), new SaradominBrew(),
      new CrystalShield(), new SuperRestore(), new AncestralRobetop(), new AncestralRobebottom(),
      new SaradominBrew(), new StaminaPotion(), new SaradominBrew(), new SaradominBrew(),
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
      new SuperRestore(), new SaradominBrew(), new SuperRestore(), new BastionPotion(), 
    ]
  }

  initialize (world: World) {


    let wave = parseInt(BrowserUtils.getQueryVar('wave')) || 62
    if (isNaN(wave)){
      wave = 1;
    }


    // Add player
    const player = new Player(
      world,
      { x: parseInt(BrowserUtils.getQueryVar('x')) || 25, y: parseInt(BrowserUtils.getQueryVar('y')) || 25 },
      { equipment: { 
          weapon: new TwistedBow(),
          helmet: new JusticiarFaceguard(),
          necklace: new NecklaceOfAnguish(),
          cape: new AvasAssembler(),
          ammo: new HolyBlessing(),
          chest: new ArmadylChestplate(),
          legs: new ArmadylChainskirt(),
          feet: new PegasianBoots(),
          gloves: new BarrowsGloves(),
          ring: new RingOfSufferingImbued(), 
        },
        inventory: this.getInventory()
      })
    world.setPlayer(player)



    if (wave < 67) {
      // Add pillars
      InfernoPillar.addPillarsToWorld(world)
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
    if (wave < 67) {
      player.location = { x: 28, y: 17}

      const bat = BrowserUtils.getQueryVar('bat') || '[]'
      const blob = BrowserUtils.getQueryVar('blob') || '[]'
      const melee = BrowserUtils.getQueryVar('melee') || '[]'
      const ranger = BrowserUtils.getQueryVar('ranger') || '[]'
      const mager = BrowserUtils.getQueryVar('mager') || '[]'
      const replayLink = document.getElementById('replayLink') as HTMLLinkElement;
  
      // world.addMob(new JalMejRah(world, {x: 0, y: 0}, { aggro: player}))
      
      if (bat != '[]' || blob != '[]' || melee != '[]' || ranger != '[]' || mager != '[]') {
        // Backwards compatibility layer for runelite plugin
        world.wave = 1;
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
    }else if (wave === 67){ 
 
      player.location = { x: 18, y: 25}
      const jad = new JalTokJad(world, { x: 23, y: 27}, { aggro: player, attackSpeed: 8, stun: 1, healers: 5, isZukWave: false });
      world.addMob(jad)
    }else if (wave === 68){ 
      player.location = { x: 25, y: 27}

      const jad1 = new JalTokJad(world, { x: 18, y: 24}, { aggro: player, attackSpeed: 9, stun: 1, healers: 3, isZukWave: false });
      world.addMob(jad1)

      const jad2 = new JalTokJad(world, { x: 28, y: 24}, { aggro: player, attackSpeed: 9, stun: 7, healers: 3, isZukWave: false });
      world.addMob(jad2)

      const jad3 = new JalTokJad(world, { x: 23, y: 35}, { aggro: player, attackSpeed: 9, stun: 4, healers: 3, isZukWave: false });
      world.addMob(jad3)
    }else if (wave === 69){
      player.location = { x: 25, y: 15}

      // spawn zuk
      const shield = new ZukShield(world, { x: 23, y: 13}, {});
      world.addMob(shield)

      world.addMob(new TzKalZuk(world, { x: 22, y: 8}, { aggro: player }))

      world.addEntity(new Wall(world, {x: 21, y: 8}));
      world.addEntity(new Wall(world, {x: 21, y: 7}));
      world.addEntity(new Wall(world, {x: 21, y: 6}));
      world.addEntity(new Wall(world, {x: 21, y: 5}));
      world.addEntity(new Wall(world, {x: 21, y: 4}));
      world.addEntity(new Wall(world, {x: 21, y: 3}));
      world.addEntity(new Wall(world, {x: 21, y: 2}));
      world.addEntity(new Wall(world, {x: 21, y: 1}));
      world.addEntity(new Wall(world, {x: 21, y: 0}));
      world.addEntity(new Wall(world, {x: 29, y: 8}));
      world.addEntity(new Wall(world, {x: 29, y: 7}));
      world.addEntity(new Wall(world, {x: 29, y: 6}));
      world.addEntity(new Wall(world, {x: 29, y: 5}));
      world.addEntity(new Wall(world, {x: 29, y: 4}));
      world.addEntity(new Wall(world, {x: 29, y: 3}));
      world.addEntity(new Wall(world, {x: 29, y: 2}));
      world.addEntity(new Wall(world, {x: 29, y: 1}));
      world.addEntity(new Wall(world, {x: 29, y: 0}));

      world.addEntity(new TileMarker(world, {x: 14, y: 14}, '#00FF00'));

      world.addEntity(new TileMarker(world, {x: 16, y: 14}, '#FF0000'));
      world.addEntity(new TileMarker(world, {x: 17, y: 14}, '#FF0000'));
      world.addEntity(new TileMarker(world, {x: 18, y: 14}, '#FF0000'));

      world.addEntity(new TileMarker(world, {x: 20, y: 14}, '#00FF00'));
      
      world.addEntity(new TileMarker(world, {x: 30, y: 14}, '#00FF00'));


      world.addEntity(new TileMarker(world, {x: 32, y: 14}, '#FF0000'));
      world.addEntity(new TileMarker(world, {x: 33, y: 14}, '#FF0000'));
      world.addEntity(new TileMarker(world, {x: 34, y: 14}, '#FF0000'));


      world.addEntity(new TileMarker(world, {x: 36, y: 14}, '#00FF00'));

    }

    player.perceivedLocation = player.location
    player.destinationLocation = player.location
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
