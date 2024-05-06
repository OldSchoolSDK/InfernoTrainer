import { Legs } from "../../sdk/gear/Legs";
import { ItemName } from "../../sdk/ItemName";
export declare class AncestralRobebottom extends Legs {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    Model: string;
    get model(): string;
}
