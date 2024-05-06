import { Unit } from "../Unit";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses, Weapon } from "../gear/Weapon";
import { EquipmentTypes } from "../Equipment";
export declare class RangedWeapon extends Weapon {
    get type(): EquipmentTypes;
    registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses, options?: ProjectileOptions): void;
    calculateHitDelay(distance: number): number;
    _calculatePrayerEffects(from: Unit, to: Unit, bonuses: AttackBonuses): void;
    isBlockable(from: Unit, to: Unit, bonuses: AttackBonuses): boolean;
    _rangedAttack(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _defenceRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _accuracyMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _damageMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses): number;
}
