import { Feet } from "../../sdk/gear/Feet";
import { ItemName } from "../../sdk/ItemName";
export declare class SaradominDhideBoots extends Feet {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
}
