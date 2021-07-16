import _ from "lodash";

export class MobDeathStore {
  static mobDeathStore = new MobDeathStore();
  static deadMobs = [];
  static npcDied(mob) {
    console.log('ded', mob);
    if (!mob.hasResurrected){
      console.log('adding')
      MobDeathStore.deadMobs.push(mob);
    }
  }

  static selectMobToResurect(){
    if (MobDeathStore.deadMobs.length) {
      const mobToResurrect = _.shuffle(MobDeathStore.deadMobs)[0];
      mobToResurrect.hasResurrected = true;
      _.remove(MobDeathStore.deadMobs, mobToResurrect);
      return mobToResurrect;
    }
    return null;
  }
}