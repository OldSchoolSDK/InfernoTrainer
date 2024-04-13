import { Unit } from "../Unit";
import { BarrageSpell } from "./BarrageSpell";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { ItemName } from "../ItemName";

export class BloodBarrageSpell extends BarrageSpell {
  get itemName(): ItemName {
    return ItemName.BLOOD_BARRAGE;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    super.attack(from, to, bonuses, options);
    if (from.currentStats.hitpoint < from.stats.hitpoint) {
      from.currentStats.hitpoint += Math.floor(this.damageRoll * 0.25);
      from.currentStats.hitpoint = Math.max(Math.min(from.stats.hitpoint, from.currentStats.hitpoint), 0);
    }
    return true;
  }
}
