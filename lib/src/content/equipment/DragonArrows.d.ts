import { Ammo } from "../../sdk/gear/Ammo";
import { ItemName } from "../../sdk/ItemName";
export declare class DragonArrows extends Ammo {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get weight(): number;
    get itemName(): ItemName;
    constructor();
}
