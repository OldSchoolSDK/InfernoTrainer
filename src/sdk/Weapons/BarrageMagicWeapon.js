import MagicWeapon from "./MagicWeapon";

export default class BarrageMagicWeapon extends MagicWeapon {
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

  get maxConcurrentHits() {
    return 9;
  }

  attack(from, to, bonuses = {}){
    super.attack(from, to, bonuses)
    console.log('damage', this.damage);
    if (this.damage > 0){
      to.frozen = 32;
    }
  }
}