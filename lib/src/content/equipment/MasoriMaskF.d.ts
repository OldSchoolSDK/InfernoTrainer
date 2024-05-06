import { ItemName } from "../../sdk/ItemName";
import { Helmet } from "../../sdk/gear/Helmet";
export declare class MasoriMaskF extends Helmet {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    get weight(): number;
    constructor();
    get model(): string;
    Model: string;
}
