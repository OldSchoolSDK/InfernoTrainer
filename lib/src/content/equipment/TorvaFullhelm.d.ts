import { ItemName } from "../../sdk/ItemName";
import { Helmet } from "../../sdk/gear/Helmet";
export declare class TorvaFullhelm extends Helmet {
    inventorySprite: HTMLImageElement;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
    get model(): string;
}
