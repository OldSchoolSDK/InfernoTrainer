import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { BarrageSpell } from "../../sdk/weapons/BarrageSpell";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Unit } from "../../sdk/Unit";
export declare class KodaiWand extends MeleeWeapon {
    autocastSpell: BarrageSpell;
    constructor();
    attack(from: Unit, to: Unit, bonuses?: AttackBonuses): boolean;
    attackStyles(): AttackStyle[];
    attackStyleCategory(): AttackStyleTypes;
    defaultStyle(): AttackStyle;
    get weight(): number;
    get itemName(): ItemName;
    get isTwoHander(): boolean;
    hasSpecialAttack(): boolean;
    get attackRange(): 1 | 10;
    get attackSpeed(): 4 | 5;
    get inventoryImage(): string;
}
