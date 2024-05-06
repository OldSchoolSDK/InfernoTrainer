import { Helmet } from "../../sdk/gear/Helmet";
import { ItemName } from "../../sdk/ItemName";
export declare class RobinhoodHat extends Helmet {
    inventorySprite: HTMLImageElement;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
}
