import { Mob } from "../Mob";
import { Pathing } from "../Pathing";
import { Unit } from "../Unit";
import { MagicWeapon } from "./MagicWeapon";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { XpDrop } from "../XpDrop";

export class BarrageSpell extends MagicWeapon {
  get aoe() {
    return [
      { x: 0, y: 0 }, // always freeze middles first
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
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

  cast(from: Unit, to: Unit) {
    from.grantXp(new XpDrop("magic", 52));
    // calculate AoE magic effects
    if (this.aoe.length) {
      const alreadyCastedOn: Unit[] = [to];
      this.attack(from, to, { magicBaseSpellDamage: 30, attackStyle: "magic" });
      this.aoe.forEach((point) => {
        Pathing.mobsAtAoeOffset(from.region, to, point).forEach((mob: Mob) => {
          if (alreadyCastedOn.length > this.maxConcurrentHits) {
            return;
          }
          if (alreadyCastedOn.indexOf(mob) > -1) {
            return;
          }
          alreadyCastedOn.push(mob);
          this.attack(from, mob, { magicBaseSpellDamage: 30, attackStyle: "magic" }, { hidden: true });
        });
      });
    } else {
      this.attack(from, to, { magicBaseSpellDamage: 30, attackStyle: "magic" });
    }
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    options.forceSWTile = true;
    return super.attack(from, to, bonuses, options);
  }
}
