import { Necklace } from "../../sdk/gear/Necklace";
import { ItemName } from "../../sdk/ItemName";
export declare class OccultNecklace extends Necklace {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
}
