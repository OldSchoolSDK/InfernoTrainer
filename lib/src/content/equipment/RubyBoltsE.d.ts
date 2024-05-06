import { Ammo } from "../../sdk/gear/Ammo";
import { ItemName } from "../../sdk/ItemName";
export declare class RubyBoltsE extends Ammo {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get weight(): number;
    get itemName(): ItemName;
    constructor();
}
