'use strict';
import _, { random } from 'lodash';
import { Bat } from "./mobs/Bat";
import { Blob } from './mobs/Blob';
import { Mager } from './mobs/Mager';
import { Meleer } from './mobs/Meleer';
import { Nibbler } from './mobs/Nibbler';
import { Ranger } from './mobs/Ranger';

export class Waves {

  static currentSpawn = null;

  static getRandomSpawns() { 
      return _.shuffle(Waves.spawns);
  }

  static spawn(region, randomPillar, spawns, wave){
    Waves.currentSpawn = spawns;
    const mobCounts = Waves.waves[wave - 1];
    let mobs = [];
    let i=0;
    Array(mobCounts[5]).fill(0).forEach(() => mobs.push(new Mager(region, spawns[i++], { aggro: region.player })));
    Array(mobCounts[4]).fill(0).forEach(() => mobs.push(new Ranger(region, spawns[i++], { aggro: region.player })));
    Array(mobCounts[3]).fill(0).forEach(() => mobs.push(new Meleer(region, spawns[i++], { aggro: region.player })));
    Array(mobCounts[2]).fill(0).forEach(() => mobs.push(new Blob(region, spawns[i++], { aggro: region.player })));
    Array(mobCounts[1]).fill(0).forEach(() => mobs.push(new Bat(region, spawns[i++], { aggro: region.player })));

    mobs = mobs.concat(Waves.spawnNibblers(mobCounts[0], region, randomPillar));
    return mobs;  
  }

  static spawnNibblers(n, region, pillar) {
    const mobs = [];
    const nibblerSpawns = _.shuffle([
      { x: 8, y: 13},
      { x: 9, y: 13},
      { x: 10, y: 13},
      { x: 8, y: 12},
      { x: 9, y: 12},
      { x: 10, y: 12},
      { x: 8, y: 11},
      { x: 9, y: 11},
      { x: 10, y: 11}      
    ]);
    
    Array(n).fill(0).forEach(() => mobs.push(new Nibbler(region, nibblerSpawns.shift(), { aggro: pillar || region.player })));
    return mobs;
  }
  

  static spawns = [
    { x: 1, y: 5},
    { x: 22, y: 5},
    { x: 3, y: 11},
    { x: 23, y: 12},
    { x: 16, y: 17},
    { x: 5, y: 23},
    { x: 23, y: 25},
    { x: 1, y: 28},
    { x: 15, y: 28}
  ];

  // cba to convert this to any other format
  // nibblers, bats, blobs, melee, ranger, mager
  static waves = [
    [3, 1, 0, 0, 0, 0], //1
    [3, 2, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0],
    [3, 0, 1, 0, 0, 0],
    [3, 1, 1, 0, 0, 0],
    [3, 2, 1, 0, 0, 0],
    [3, 0, 2, 0, 0, 0], //7
    [6, 0, 0, 0, 0, 0],
    [3, 0, 0, 1, 0, 0],
    [3, 1, 0, 1, 0, 0],
    [3, 2, 0, 1, 0, 0],
    [3, 0, 1, 1, 0, 0],
    [3, 1, 1, 1, 0, 0],
    [3, 2, 1, 1, 0, 0],
    [3, 0, 2, 1, 0, 0], //15
    [3, 0, 0, 2, 0, 0],
    [6, 0, 0, 0, 0, 0], //17
    [3, 0, 0, 0, 1, 0],
    [3, 1, 0, 0, 1, 0],
    [3, 2, 0, 0, 1, 0],
    [3, 0, 1, 0, 1, 0], //21
    [3, 1, 1, 0, 1, 0],
    [3, 2, 1, 0, 1, 0], //23
    [3, 0, 2, 0, 1, 0], //24
    [3, 0, 0, 1, 1, 0], //25
    [3, 1, 0, 1, 1, 0], //26
    [3, 2, 0, 1, 1, 0], //27
    [3, 0, 1, 1, 1, 0], //28
    [3, 1, 1, 1, 1, 0], //29
    [3, 2, 1, 1, 1, 0], //30
    [3, 0, 2, 1, 1, 0], //31
    [3, 0, 0, 2, 1, 0], //32
    [3, 0, 0, 0, 2, 0], //33
    [6, 0, 0, 0, 0, 0], //34
    [3, 0, 0, 0, 0, 1], //35
    [3, 1, 0, 0, 0, 1], //36
    [3, 2, 0, 0, 0, 1], //37
    [3, 0, 1, 0, 0, 1], //38
    [3, 1, 1, 0, 0, 1], //39
    [3, 2, 1, 0, 0, 1], //40
    [3, 0, 2, 0, 0, 1], //41 double blob mage
    [3, 0, 0, 1, 0, 1], //42
    [3, 1, 0, 1, 0, 1], //43
    [3, 2, 0, 1, 0, 1], //44
    [3, 0, 1, 1, 0, 1], //45
    [3, 1, 1, 1, 0, 1], //46
    [3, 2, 1, 1, 0, 1], //47
    [3, 0, 2, 1, 0, 1], //48 double blob melee mage
    [3, 0, 0, 2, 0, 1], //49 2 melee mage
    [3, 0, 0, 0, 1, 1], //50
    [3, 1, 0, 0, 1, 1], //51
    [3, 2, 0, 0, 1, 1], //52
    [3, 0, 1, 0, 1, 1], //53
    [3, 1, 1, 0, 1, 1], //54
    [3, 2, 1, 0, 1, 1], //55
    [3, 0, 2, 0, 1, 1], //56
    [3, 0, 0, 1, 1, 1], //57
    [3, 1, 0, 1, 1, 1], //58
    [3, 2, 0, 1, 1, 1], //59
    [3, 0, 1, 1, 1, 1], //60
    [3, 1, 1, 1, 1, 1], //61
    [3, 2, 1, 1, 1, 1], //62
    [3, 0, 2, 1, 1, 1], //63
    [3, 0, 0, 2, 1, 1], //64
    [3, 0, 0, 0, 2, 1], //65
    [3, 0, 0, 0, 0, 2] //66
  ];
}