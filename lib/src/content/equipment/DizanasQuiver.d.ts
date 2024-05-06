import { Cape } from "../../sdk/gear/Cape";
import { ItemName } from "../../sdk/ItemName";
import { Equipment } from "../../sdk/Equipment";
export declare class DizanasQuiver extends Cape {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    updateBonuses(gear: Equipment[]): void;
    get model(): string;
    Model: string;
}
