'use strict'
import { shuffle } from 'lodash'
import { Entity } from '../../../sdk/Entity'
import { Mob } from '../../../sdk/Mob'
import { World } from '../../../sdk/World'
import { UnitOptions } from '../../../sdk/Unit'
import { JalMejRah } from './mobs/JalMejRah'
import { JalAk } from './mobs/JalAk'
import { JalZek } from './mobs/JalZek'
import { JalImKot } from './mobs/JalImKot'
import { JalNib } from './mobs/JalNib'
import { JalXil } from './mobs/JalXil'
import { Location } from "../../../sdk/Location"
import { Collision } from '../../../sdk/Collision'


export class InfernoWaves {

  static getRandomSpawns () {
    return shuffle(InfernoWaves.spawns)
  }

  static spawn (world: World, randomPillar: Entity, spawns: Location[], wave: number) {

    const mobCounts = InfernoWaves.waves[wave - 1]
    let mobs: Mob[] = []
    let i = 0
    Array(mobCounts[5]).fill(0).forEach(() => mobs.push(new JalZek(world, spawns[i++], { aggro: world.player })))
    Array(mobCounts[4]).fill(0).forEach(() => mobs.push(new JalXil(world, spawns[i++], { aggro: world.player })))
    Array(mobCounts[3]).fill(0).forEach(() => mobs.push(new JalImKot(world, spawns[i++], { aggro: world.player })))
    Array(mobCounts[2]).fill(0).forEach(() => mobs.push(new JalAk(world, spawns[i++], { aggro: world.player })))
    Array(mobCounts[1]).fill(0).forEach(() => mobs.push(new JalMejRah(world, spawns[i++], { aggro: world.player })))

    mobs = mobs.concat(InfernoWaves.spawnNibblers(mobCounts[0], world, randomPillar))
    return mobs
  }

  static spawnEnduranceMode (world: World, concurrentSpawns: number, check: boolean = false) {
    let j = 0;

    let mobs: Mob[] = []
    const randomSpawns = InfernoWaves.getRandomSpawns();
    for (let i=0;i<concurrentSpawns;i++) {
      const mobTypes: typeof Mob[] = [
        JalZek,
        JalXil,
        JalImKot,
        JalAk,
        JalMejRah
      ];

      const randomType = mobTypes[Math.floor(Math.random() * 5)]


      let attempts = 0;
      let randomSpawn = null;
      if (check) {
        do{
          randomSpawn = randomSpawns[j++]
        } while(j < randomSpawns.length && Collision.collidesWithAnyMobs(world, randomSpawn.x, randomSpawn.y, 4));
      }else{
        randomSpawn = randomSpawns[j++]
      }
      if (randomSpawn){
        mobs.push(new randomType(world, randomSpawn, { aggro: world.player }));
      }
    }

    return mobs
  }

  static spawnNibblers (n: number, world: World, pillar: Entity) {
    return [];
    const mobs: Mob[] = []
    const nibblerSpawns = shuffle([
      { x: 8 + 11, y: 13 + 14 },
      { x: 9 + 11, y: 13 + 14 },
      { x: 10 + 11, y: 13 + 14 },
      { x: 8 + 11, y: 12 + 14 },
      { x: 9 + 11, y: 12 + 14 },
      { x: 10 + 11, y: 12 + 14 },
      { x: 8 + 11, y: 11 + 14 },
      { x: 9 + 11, y: 11 + 14 },
      { x: 10 + 11, y: 11 + 14 }
    ])

    const options: UnitOptions = { aggro: pillar || world.player };

    Array(n).fill(0).forEach(() => mobs.push(new JalNib(world, nibblerSpawns.shift(), options)))
    return mobs
  }

  static spawns = [
    { x: 1 + 11, y: 5 + 14 },
    { x: 22 + 11, y: 5 + 14 },
    { x: 3 + 11, y: 11 + 14 },
    { x: 23 + 11, y: 12 + 14 },
    { x: 16 + 11, y: 17 + 14 },
    { x: 5 + 11, y: 23 + 14 },
    { x: 23 + 11, y: 25 + 14 },
    { x: 1 + 11, y: 28 + 14 },
    { x: 15 + 11, y: 28 + 14 }
  ];

  // cba to convert this to any other format
  // nibblers, bats, blobs, melee, ranger, mager
  static waves = [
    [3, 1, 0, 0, 0, 0], // 1
    [3, 2, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0],
    [3, 0, 1, 0, 0, 0],
    [3, 1, 1, 0, 0, 0],
    [3, 2, 1, 0, 0, 0],
    [3, 0, 2, 0, 0, 0], // 7
    [6, 0, 0, 0, 0, 0],
    [3, 0, 0, 1, 0, 0],
    [3, 1, 0, 1, 0, 0],
    [3, 2, 0, 1, 0, 0],
    [3, 0, 1, 1, 0, 0],
    [3, 1, 1, 1, 0, 0],
    [3, 2, 1, 1, 0, 0],
    [3, 0, 2, 1, 0, 0], // 15
    [3, 0, 0, 2, 0, 0],
    [6, 0, 0, 0, 0, 0], // 17
    [3, 0, 0, 0, 1, 0],
    [3, 1, 0, 0, 1, 0],
    [3, 2, 0, 0, 1, 0],
    [3, 0, 1, 0, 1, 0], // 21
    [3, 1, 1, 0, 1, 0],
    [3, 2, 1, 0, 1, 0], // 23
    [3, 0, 2, 0, 1, 0], // 24
    [3, 0, 0, 1, 1, 0], // 25
    [3, 1, 0, 1, 1, 0], // 26
    [3, 2, 0, 1, 1, 0], // 27
    [3, 0, 1, 1, 1, 0], // 28
    [3, 1, 1, 1, 1, 0], // 29
    [3, 2, 1, 1, 1, 0], // 30
    [3, 0, 2, 1, 1, 0], // 31
    [3, 0, 0, 2, 1, 0], // 32
    [3, 0, 0, 0, 2, 0], // 33
    [6, 0, 0, 0, 0, 0], // 34
    [3, 0, 0, 0, 0, 1], // 35
    [3, 1, 0, 0, 0, 1], // 36
    [3, 2, 0, 0, 0, 1], // 37
    [3, 0, 1, 0, 0, 1], // 38
    [3, 1, 1, 0, 0, 1], // 39
    [3, 2, 1, 0, 0, 1], // 40
    [3, 0, 2, 0, 0, 1], // 41 double blob mage
    [3, 0, 0, 1, 0, 1], // 42
    [3, 1, 0, 1, 0, 1], // 43
    [3, 2, 0, 1, 0, 1], // 44
    [3, 0, 1, 1, 0, 1], // 45
    [3, 1, 1, 1, 0, 1], // 46
    [3, 2, 1, 1, 0, 1], // 47
    [3, 0, 2, 1, 0, 1], // 48 double blob melee mage
    [3, 0, 0, 2, 0, 1], // 49 2 melee mage
    [3, 0, 0, 0, 1, 1], // 50
    [3, 1, 0, 0, 1, 1], // 51
    [3, 2, 0, 0, 1, 1], // 52
    [3, 0, 1, 0, 1, 1], // 53
    [3, 1, 1, 0, 1, 1], // 54
    [3, 2, 1, 0, 1, 1], // 55
    [3, 0, 2, 0, 1, 1], // 56
    [3, 0, 0, 1, 1, 1], // 57
    [3, 1, 0, 1, 1, 1], // 58
    [3, 2, 0, 1, 1, 1], // 59
    [3, 0, 1, 1, 1, 1], // 60
    [3, 1, 1, 1, 1, 1], // 61
    [3, 2, 1, 1, 1, 1], // 62
    [3, 0, 2, 1, 1, 1], // 63
    [3, 0, 0, 2, 1, 1], // 64
    [3, 0, 0, 0, 2, 1], // 65
    [3, 0, 0, 0, 0, 2] // 66
  ];
}
