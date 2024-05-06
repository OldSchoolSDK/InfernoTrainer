import { Offhand } from "../../sdk/gear/Offhand";
import { ItemName } from "../../sdk/ItemName";
export declare class AvernicDefender extends Offhand {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    Model: string;
    get model(): string;
}
