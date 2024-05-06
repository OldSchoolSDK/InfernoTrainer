import { Unit } from "../Unit";
import { BarrageSpell } from "./BarrageSpell";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { ItemName } from "../ItemName";
export declare class IceBarrageSpell extends BarrageSpell {
    get itemName(): ItemName;
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses, options?: ProjectileOptions): boolean;
}
