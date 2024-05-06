import { Feet } from "../../sdk/gear/Feet";
import { ItemName } from "../../sdk/ItemName";
export declare class PrimordialBoots extends Feet {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    Model: string;
    get model(): string;
}
