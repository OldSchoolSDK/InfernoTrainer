import { Cape } from "../../sdk/gear/Cape";
import { ItemName } from "../../sdk/ItemName";
export declare class AvasAccumulator extends Cape {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
}
