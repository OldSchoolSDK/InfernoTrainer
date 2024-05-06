import { Unit } from "../../sdk/Unit";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Sound } from "../../sdk/utils/SoundCache";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
export declare class TwistedBow extends RangedWeapon {
    constructor(geno?: boolean);
    compatibleAmmo(): ItemName[];
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get attackSpeed(): 6 | 5;
    get attackSound(): Sound;
    get weight(): number;
    get itemName(): ItemName;
    get isTwoHander(): boolean;
    get attackRange(): number;
    get inventoryImage(): string;
    _accuracyMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    _damageMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses): number;
    Model: string;
    get model(): string;
    get attackAnimationId(): PlayerAnimationIndices;
    ProjectileModel: string;
    get projectileModel(): string;
}
