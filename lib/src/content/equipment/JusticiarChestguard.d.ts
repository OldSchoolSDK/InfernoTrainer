import { Chest } from "../../sdk/gear/Chest";
import { SetEffect } from "../../sdk/SetEffect";
import { ItemName } from "../../sdk/ItemName";
export declare class JusticiarChestguard extends Chest {
    inventorySprite: HTMLImageElement;
    get equipmentSetEffect(): typeof SetEffect;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
}
