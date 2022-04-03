import { shuffle, remove } from 'lodash'
import { DelayedAction } from '../../../sdk/DelayedAction';
import { Mob } from '../../../sdk/Mob';
import { Player } from '../../../sdk/Player';
import { Region } from '../../../sdk/Region';
import { InfernoRegion } from './InfernoRegion';
import { InfernoWaves } from './InfernoWaves';

export class InfernoMobDeathStore {
  static mobDeathStore = new InfernoMobDeathStore();
  static deadMobs: Mob[] = [];
  static npcDied (mob: Mob) {
    const region = mob.region as InfernoRegion;
    if (region.wave > 69 && region.wave < 74){
      region.score += mob.stats.hitpoint;
      DelayedAction.registerDelayedAction(new DelayedAction(() => {
        InfernoWaves.spawnEnduranceMode(region, mob.aggro as Player, 1, true).forEach((mob: Mob) => region.addMob(mob))
      }, 8));
      return;
    }
    if (!mob.hasResurrected) {
      InfernoMobDeathStore.deadMobs.push(mob)
    }
  }

  static selectMobToResurect (_region: Region) {

    const region = _region as InfernoRegion;
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
