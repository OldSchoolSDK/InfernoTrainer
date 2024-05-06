import { Unit } from "../Unit";
import { MagicWeapon } from "./MagicWeapon";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { AttackStyle } from "../AttackStylesController";
export declare class BarrageSpell extends MagicWeapon {
    get aoe(): {
        x: number;
        y: number;
    }[];
    get attackRange(): number;
    get attackSpeed(): number;
    get maxConcurrentHits(): number;
    attackStyle(): AttackStyle;
    cast(from: Unit, to: Unit): void;
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses, options?: ProjectileOptions): boolean;
}
