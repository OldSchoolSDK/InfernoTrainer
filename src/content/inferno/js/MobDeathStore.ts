import { shuffle, remove } from 'lodash'
import { Mob } from '../../../sdk/Mob';

export class MobDeathStore {
  static mobDeathStore = new MobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied (mob: Mob) {
    if (!mob.hasResurrected) {
      MobDeathStore.deadMobs.push(mob)
    }
  }

  static selectMobToResurect () {
    if (MobDeathStore.deadMobs.length) {
      const mobToResurrect = shuffle(MobDeathStore.deadMobs)[0]
      mobToResurrect.hasResurrected = true
      remove(MobDeathStore.deadMobs, mobToResurrect)
      return mobToResurrect
    }
    return null
  }
}
