import { shuffle, remove } from 'lodash'
import { DelayedAction } from '../../../sdk/DelayedAction';
import { Mob } from '../../../sdk/Mob';
import { World } from '../../../sdk/World';
import { InfernoRegion } from './InfernoRegion';
import { InfernoWaves } from './InfernoWaves';

export class InfernoMobDeathStore {
  static mobDeathStore = new InfernoMobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied (world: World, mob: Mob) {
    const region = world.region as InfernoRegion;
    if (region.wave > 69 && region.wave < 74){
      region.score += mob.stats.hitpoint;
      DelayedAction.registerDelayedAction(new DelayedAction(() => {
        InfernoWaves.spawnEnduranceMode(world, 1, true).forEach((mob: Mob) => world.region.addMob(mob))
      }, 8));
      return;
    }
    if (!mob.hasResurrected) {
      InfernoMobDeathStore.deadMobs.push(mob)
    }
  }

  static selectMobToResurect (world: World) {

    const region = world.region as InfernoRegion;
    if (region.wave > 69){
      return null;
    }
    
    if (InfernoMobDeathStore.deadMobs.length) {
      const mobToResurrect = shuffle(InfernoMobDeathStore.deadMobs)[0]
      mobToResurrect.hasResurrected = true
      remove(InfernoMobDeathStore.deadMobs, mobToResurrect)
      return mobToResurrect
    }
    return null
  }
}
