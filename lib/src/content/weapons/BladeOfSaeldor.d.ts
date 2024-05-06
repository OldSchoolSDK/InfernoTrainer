import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Sound } from "../../sdk/utils/SoundCache";
export declare class BladeOfSaeldor extends MeleeWeapon {
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
    private Model;
    get model(): string;
    get attackAnimationId(): PlayerAnimationIndices;
    get idleAnimationId(): PlayerAnimationIndices;
    get attackSound(): Sound;
}
