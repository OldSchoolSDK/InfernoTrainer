import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Sound } from "../../sdk/utils/SoundCache";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Unit } from "../../sdk/Unit";
export declare class ScytheOfVitur extends MeleeWeapon {
    constructor();
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get itemName(): ItemName;
    get isTwoHander(): boolean;
    hasSpecialAttack(): boolean;
    get attackRange(): number;
    get attackSpeed(): number;
    get inventoryImage(): string;
    attack(from: Unit, to: Unit, bonuses: AttackBonuses): boolean;
    get model(): string;
    get attackAnimationId(): PlayerAnimationIndices;
    get idleAnimationId(): PlayerAnimationIndices;
    get attackSound(): Sound;
}
