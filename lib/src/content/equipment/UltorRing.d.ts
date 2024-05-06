import { Ring } from "../../sdk/gear/Ring";
import { ItemName } from "../../sdk/ItemName";
export declare class UltorRing extends Ring {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
}
