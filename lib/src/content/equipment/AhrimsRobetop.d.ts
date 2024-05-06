import { Chest } from "../../sdk/gear/Chest";
import { ItemName } from "../../sdk/ItemName";
export declare class AhrimsRobetop extends Chest {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
}
