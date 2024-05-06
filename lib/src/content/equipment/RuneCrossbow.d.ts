import { Unit } from "../../sdk/Unit";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyleTypes, AttackStyle } from "../../sdk/AttackStylesController";
export declare class RuneCrossbow extends RangedWeapon {
    constructor();
    compatibleAmmo(): ItemName[];
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get weight(): number;
    get itemName(): ItemName;
    get isTwoHander(): boolean;
    get attackRange(): 7 | 9;
    get attackSpeed(): 6 | 5;
    get inventoryImage(): string;
    rollDamage(from: Unit, to: Unit, bonuses: AttackBonuses): void;
}
