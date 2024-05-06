import { Legs } from "../../sdk/gear/Legs";
import { SetEffect } from "../../sdk/SetEffect";
import { ItemName } from "../../sdk/ItemName";
export declare class JusticiarLegguards extends Legs {
    inventorySprite: HTMLImageElement;
    get equipmentSetEffect(): typeof SetEffect;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
}
