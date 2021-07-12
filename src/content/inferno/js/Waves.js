'use strict';
import _ from 'lodash';
import { Bat } from "./mobs/Bat";
import { Blob } from './mobs/Blob';
import { Mager } from './mobs/Mager';
import { Meleer } from './mobs/Meleer';
import { Ranger } from './mobs/Ranger';

export class Waves {

  static currentSpawn = null;

  static getRandomSpawns() { 
      return _.shuffle(Waves.spawns);
  }

  static spawn(spawns, wave){
    Waves.currentSpawn = spawns;
    const mobCounts = Waves.waves[wave - 1];
    const mobs = [];
    let i=0;
    Array(mobCounts[5]).fill(0).forEach(() => mobs.push(new Mager(spawns[i++])));
    Array(mobCounts[4]).fill(0).forEach(() => mobs.push(new Ranger(spawns[i++])));
    Array(mobCounts[3]).fill(0).forEach(() => mobs.push(new Meleer(spawns[i++])));
    Array(mobCounts[2]).fill(0).forEach(() => mobs.push(new Blob(spawns[i++])));
    Array(mobCounts[1]).fill(0).forEach(() => mobs.push(new Bat(spawns[i++])));
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
    [0, 1, 0, 0, 0, 0], //1
    [0, 2, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 2, 1, 0, 0, 0],
    [0, 0, 2, 0, 0, 0], //7
    [6, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 2, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0],
    [0, 2, 1, 1, 0, 0],
    [0, 0, 2, 1, 0, 0], //15
    [0, 0, 0, 2, 0, 0],
    [6, 0, 0, 0, 0, 0], //17
    [0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 2, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0], //21
    [0, 1, 1, 0, 1, 0],
    [0, 2, 1, 0, 1, 0], //23
    [0, 0, 2, 0, 1, 0], //24
    [0, 0, 0, 1, 1, 0], //25
    [0, 1, 0, 1, 1, 0], //26
    [0, 2, 0, 1, 1, 0], //27
    [0, 0, 1, 1, 1, 0], //28
    [0, 1, 1, 1, 1, 0], //29
    [0, 2, 1, 1, 1, 0], //30
    [0, 0, 2, 1, 1, 0], //31
    [0, 0, 0, 2, 1, 0], //32
    [0, 0, 0, 0, 2, 0], //33
    [6, 0, 0, 0, 0, 0], //34
    [0, 0, 0, 0, 0, 1], //35
    [0, 1, 0, 0, 0, 1], //36
    [0, 2, 0, 0, 0, 1], //37
    [0, 0, 1, 0, 0, 1], //38
    [0, 1, 1, 0, 0, 1], //39
    [0, 2, 1, 0, 0, 1], //40
    [0, 0, 2, 0, 0, 1], //41 double blob mage
    [0, 0, 0, 1, 0, 1], //42
    [0, 1, 0, 1, 0, 1], //43
    [0, 2, 0, 1, 0, 1], //44
    [0, 0, 1, 1, 0, 1], //45
    [0, 1, 1, 1, 0, 1], //46
    [0, 2, 1, 1, 0, 1], //47
    [0, 0, 2, 1, 0, 1], //48 double blob melee mage
    [0, 0, 0, 2, 0, 1], //49 2 melee mage
    [0, 0, 0, 0, 1, 1], //50
    [0, 1, 0, 0, 1, 1], //51
    [0, 2, 0, 0, 1, 1], //52
    [0, 0, 1, 0, 1, 1], //53
    [0, 1, 1, 0, 1, 1], //54
    [0, 2, 1, 0, 1, 1], //55
    [0, 0, 2, 0, 1, 1], //56
    [0, 0, 0, 1, 1, 1], //57
    [0, 1, 0, 1, 1, 1], //58
    [0, 2, 0, 1, 1, 1], //59
    [0, 0, 1, 1, 1, 1], //60
    [0, 1, 1, 1, 1, 1], //61
    [0, 2, 1, 1, 1, 1], //62
    [0, 0, 2, 1, 1, 1], //63
    [0, 0, 0, 2, 1, 1], //64
    [0, 0, 0, 0, 2, 1], //65
    [0, 0, 0, 0, 0, 2] //66
  ];
}