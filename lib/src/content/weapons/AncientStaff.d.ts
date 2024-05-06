import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
export declare class AncientStaff extends MeleeWeapon {
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
}
