import { Helmet } from "../../sdk/gear/Helmet";
import { SetEffect } from "../../sdk/SetEffect";
import { ItemName } from "../../sdk/ItemName";
export declare class JusticiarFaceguard extends Helmet {
    inventorySprite: HTMLImageElement;
    get equipmentSetEffect(): typeof SetEffect;
    get itemName(): ItemName;
    get weight(): number;
    get inventoryImage(): string;
    constructor();
}
