import { Mob, Region } from "osrs-sdk";

import { shuffle, remove } from "lodash";
import { JalImKot } from "./mobs/JalImKot";

export class InfernoMobDeathStore {
  static mobDeathStore = new InfernoMobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied(mob: Mob) {
    if (!mob.hasResurrected) {
      InfernoMobDeathStore.deadMobs.push(mob);
    }
  }

  static selectMobToResurect(_region: Region, forceMelee = false) {
    if (InfernoMobDeathStore.deadMobs.length) {
      const mobToResurrect = forceMelee
        ? InfernoMobDeathStore.deadMobs.find(mob => mob instanceof JalImKot)
        : shuffle(InfernoMobDeathStore.deadMobs)[0];
      mobToResurrect.hasResurrected = true;
      remove(InfernoMobDeathStore.deadMobs, mobToResurrect);
      return mobToResurrect;
    }
    return null;
  }

  static clearDeadMobs() {
    InfernoMobDeathStore.deadMobs = [];
  }
}