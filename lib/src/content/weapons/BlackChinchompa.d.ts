import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { Sound } from "../../sdk/utils/SoundCache";
import { ProjectileOptions } from "../../sdk/weapons/Projectile";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Unit } from "../../sdk/Unit";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
export declare class BlackChinchompa extends RangedWeapon {
    maxConcurrentHits: number;
    constructor();
    calculateHitDelay(distance: number): number;
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get attackSpeed(): 4 | 3;
    get weight(): number;
    get itemName(): ItemName;
    get isTwoHander(): boolean;
    get attackRange(): 10 | 9;
    get inventoryImage(): string;
    get attackSound(): Sound;
    get attackLandingSound(): Sound;
    get aoe(): {
        x: number;
        y: number;
    }[];
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses, options?: ProjectileOptions): boolean;
    Model: string;
    get model(): string;
    get attackAnimationId(): PlayerAnimationIndices;
}
