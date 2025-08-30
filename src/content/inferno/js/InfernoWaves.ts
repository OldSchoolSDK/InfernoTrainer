"use strict";

import { Random, Region, Player, Entity, Mob, Collision, UnitOptions, Location, Unit } from "@supalosa/oldschool-trainer-sdk";

import { shuffle } from "lodash";

import { JalMejRah } from "./mobs/JalMejRah";
import { JalAk } from "./mobs/JalAk";
import { JalZek } from "./mobs/JalZek";
import { JalImKot } from "./mobs/JalImKot";
import { JalNib } from "./mobs/JalNib";
import { JalXil } from "./mobs/JalXil";

export class InfernoWaves {
  static shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Random.get() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  static getRandomSpawns() {
    return InfernoWaves.shuffle(InfernoWaves.spawns);
  }

  static spawn(region: Region, player: Player, randomPillar: Entity, spawns: Location[], wave: number) {
    const mobCounts = InfernoWaves.waves[wave - 1];
    let mobs: Mob[] = [];
    let i = 0;
    Array(mobCounts[5])
      .fill(0)
      .forEach(() => mobs.push(new JalZek(region, spawns[i++], { aggro: player })));
    Array(mobCounts[4])
      .fill(0)
      .forEach(() => mobs.push(new JalXil(region, spawns[i++], { aggro: player })));
    Array(mobCounts[3])
      .fill(0)
      .forEach(() => mobs.push(new JalImKot(region, spawns[i++], { aggro: player })));
    Array(mobCounts[2])
      .fill(0)
      .forEach(() => mobs.push(new JalAk(region, spawns[i++], { aggro: player })));
    Array(mobCounts[1])
      .fill(0)
      .forEach(() => mobs.push(new JalMejRah(region, spawns[i++], { aggro: player })));

    mobs = mobs.concat(InfernoWaves.spawnNibblers(mobCounts[0], region, randomPillar));
    return mobs;
  }

  static spawnEnduranceMode(region: Region, player: Player, concurrentSpawns: number, check = false) {
    let j = 0;

    const mobs: Mob[] = [];
    let randomSpawns = [
      { x: 12, y: 19 },
      { x: 33, y: 19 },
      { x: 14, y: 25 },
      { x: 34, y: 26 },
      { x: 27, y: 31 },
      { x: 16, y: 37 },
      { x: 34, y: 39 },
      { x: 12, y: 42 },
      { x: 26, y: 42 },
    ];

    randomSpawns = shuffle(randomSpawns);

    for (let i = 0; i < concurrentSpawns; i++) {
      const mobTypes: (typeof Mob)[] = [JalZek, JalXil, JalImKot, JalAk, JalMejRah];

      const randomType = mobTypes[Math.floor(Random.get() * 5)];

      let randomSpawn = null;
      if (check) {
        do {
          randomSpawn = randomSpawns[j++];
        } while (j < randomSpawns.length && Collision.collidesWithAnyMobs(region, randomSpawn.x, randomSpawn.y, 4));
      } else {
        randomSpawn = randomSpawns[j++];
      }
      if (randomSpawn) {
        mobs.push(new randomType(region, randomSpawn, { aggro: player }));
      }
    }

    return mobs;
  }

  static spawnNibblers(n: number, region: Region, pillar: Entity) {
    const mobs: Mob[] = [];
    const nibblerSpawns = shuffle([
      { x: 8 + 11, y: 13 + 14 },
      { x: 9 + 11, y: 13 + 14 },
      { x: 10 + 11, y: 13 + 14 },
      { x: 8 + 11, y: 12 + 14 },
      { x: 9 + 11, y: 12 + 14 },
      { x: 10 + 11, y: 12 + 14 },
      { x: 8 + 11, y: 11 + 14 },
      { x: 9 + 11, y: 11 + 14 },
      { x: 10 + 11, y: 11 + 14 },
    ]);

    const unknownPillar = pillar as unknown;

    // hack hack hack
    const options: UnitOptions = { aggro: unknownPillar as Unit /* TODO: || world.player */ };

    Array(n)
      .fill(0)
      .forEach(() => mobs.push(new JalNib(region, nibblerSpawns.shift(), options)));
    return mobs;
  }

  static spawns = [
    { x: 12, y: 19 },
    { x: 33, y: 19 },
    { x: 14, y: 25 },
    { x: 34, y: 26 },
    { x: 27, y: 31 },
    { x: 16, y: 37 },
    { x: 34, y: 39 },
    { x: 12, y: 42 },
    { x: 26, y: 42 },
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
    [3, 0, 0, 0, 0, 2], // 66
  ];
}
