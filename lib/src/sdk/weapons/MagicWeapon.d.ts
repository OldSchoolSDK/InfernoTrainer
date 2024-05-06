import { Unit } from "../Unit";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses, Weapon } from "../gear/Weapon";
import { EquipmentTypes } from "../Equipment";
export declare class MagicWeapon extends Weapon {
    constructor(projectileRules?: ProjectileOptions);
    get type(): EquipmentTypes;
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses, options?: ProjectileOptions): boolean;
    calculateHitDelay(distance: number): number;
    isBlockable(from: Unit, to: Unit, bonuses: AttackBonuses): boolean;
    _calculatePrayerEffects(from: Unit, to: Unit, bonuses: AttackBonuses): void;
    _magicLevel(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _equipmentBonus(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _magicDamageBonusMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _defenceRoll(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _baseSpellDamage(from: Unit, to: Unit, bonuses: AttackBonuses): number;
}
