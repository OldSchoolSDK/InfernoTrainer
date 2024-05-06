import { ItemName } from "../../sdk/ItemName";
import { Cape } from "../../sdk/gear/Cape";
export declare class InfernalCape extends Cape {
    inventorySprite: HTMLImageElement;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
    get model(): string;
}
