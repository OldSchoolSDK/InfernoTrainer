import { ItemName } from "../../sdk/ItemName";
import { Legs } from "../../sdk/gear/Legs";
export declare class TorvaPlatelegs extends Legs {
    inventorySprite: HTMLImageElement;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
    get model(): string;
}
