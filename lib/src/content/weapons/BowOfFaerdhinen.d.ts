import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { ItemName } from "../../sdk/ItemName";
import { Unit } from "../../sdk/Unit";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Sound } from "../../sdk/utils/SoundCache";
export declare class BowOfFaerdhinen extends RangedWeapon {
    constructor();
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get attackSound(): Sound;
    get attackSpeed(): 4 | 5;
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
}
