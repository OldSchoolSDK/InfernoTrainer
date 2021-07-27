import { shuffle, remove } from 'lodash'
import { Mob } from '../../../sdk/Mob';

export class InfernoMobDeathStore {
  static mobDeathStore = new InfernoMobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied (mob: Mob) {
    if (!mob.hasResurrected) {
      InfernoMobDeathStore.deadMobs.push(mob)
    }
  }

  static selectMobToResurect () {
    if (InfernoMobDeathStore.deadMobs.length) {
      const mobToResurrect = shuffle(InfernoMobDeathStore.deadMobs)[0]
      mobToResurrect.hasResurrected = true
      remove(InfernoMobDeathStore.deadMobs, mobToResurrect)
      return mobToResurrect
    }
    return null
  }
}
