import { ItemName } from "../../sdk/ItemName";
import { Food } from "../../sdk/gear/Food";
export declare class Shark extends Food {
    healAmount: number;
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
}
