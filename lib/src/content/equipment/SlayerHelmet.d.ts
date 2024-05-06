import { Helmet } from "../../sdk/gear/Helmet";
import { ItemName } from "../../sdk/ItemName";
export declare class SlayerHelmet extends Helmet {
    inventorySprite: HTMLImageElement;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
    Model: string;
    get model(): string;
}
