import { Mob, Region } from "@supalosa/oldschool-trainer-sdk";

import { shuffle, remove } from "lodash";

export class InfernoMobDeathStore {
  static mobDeathStore = new InfernoMobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied(mob: Mob) {
    if (!mob.hasResurrected) {
      InfernoMobDeathStore.deadMobs.push(mob);
    }
  }

  static selectMobToResurect(_region: Region) {
    if (InfernoMobDeathStore.deadMobs.length) {
      const mobToResurrect = shuffle(InfernoMobDeathStore.deadMobs)[0];
      mobToResurrect.hasResurrected = true;
      remove(InfernoMobDeathStore.deadMobs, mobToResurrect);
      return mobToResurrect;
    }
    return null;
  }
}
