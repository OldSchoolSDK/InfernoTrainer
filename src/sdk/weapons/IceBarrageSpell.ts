import { Unit } from "../Unit";
import { BarrageSpell } from "./BarrageSpell";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { ItemName } from "../ItemName";

export class IceBarrageSpell extends BarrageSpell {
  get itemName(): ItemName {
    return ItemName.ICE_BARRAGE;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    super.attack(from, to, bonuses, options);
    if (this.lastHitHit) {
      to.freeze(32);
    }
    return true;
  }
}
