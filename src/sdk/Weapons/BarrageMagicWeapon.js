import { Pathing } from "../Pathing";
import { MagicWeapon } from "./MagicWeapon";

export class BarrageMagicWeapon extends MagicWeapon {
  get name() {
    return "Ice Barrage";
  }

  get aoe() {
    return [
      {x: 0, y: 0}, // always freeze middles first
      {x: -1, y: -1},
      {x: -1, y: 0},
      {x: -1, y: 1},
      {x: 0, y: -1},
      {x: 0, y: 1},
      {x: 1, y: -1},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ]
  }

  get attackRange() {
    return 10;
  }

  get attackSpeed() {
    return 5;
  }

  get maxConcurrentHits() {
    return 9;
  }

  cast(stage, from, to) {

    // calculate AoE magic effects
    if (this.aoe.length) {
      let castsAllowed = this.maxConcurrentHits;
      const alreadyCastedOn = [];
      this.aoe.forEach((point) => {
        Pathing.mobsAroundMob(stage, to, point)
        .forEach((mob) =>{
          if (castsAllowed <= 0) {
            return;
          }
          if (alreadyCastedOn.indexOf(mob) > -1) {
            return;
          }
          alreadyCastedOn.push(mob);
          castsAllowed--;
          this.attack(stage, from, mob, {magicBaseSpellDamage: 30});
        })
      });
    }else{
      this.attack(stage, from, to, {magicBaseSpellDamage: 30});
    }
  }

  attack(stage, from, to, bonuses = {}){
    super.attack(stage, from, to, bonuses, true)
    if (this.damage > 0){
      to.frozen = 32;
    }
  }
}