import { Cape } from "../../sdk/gear/Cape";
import { ItemName } from "../../sdk/ItemName";
export declare class AvasAssembler extends Cape {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    Model: string;
    get model(): string;
}
