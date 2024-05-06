import { EquipmentTypes } from "../Equipment";
import { Weapon, AttackBonuses } from "../gear/Weapon";
import { Unit } from "../Unit";
import { ProjectileOptions } from "./Projectile";
export declare class MeleeWeapon extends Weapon {
    constructor(projectileOptions?: ProjectileOptions);
    get type(): EquipmentTypes;
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses): boolean;
    _calculatePrayerEffects(from: Unit, to: Unit, bonuses: AttackBonuses): void;
    isBlockable(from: Unit, to: Unit, bonuses: AttackBonuses): boolean;
    _strengthLevel(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _attackLevel(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _defenceRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _defenceLevel(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    get isMeleeAttack(): boolean;
}
