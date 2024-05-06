import { ItemName } from "../../sdk/ItemName";
import { Food } from "../../sdk/gear/Food";
import { Player } from "../../sdk/Player";
export declare class Karambwan extends Food {
    healAmount: number;
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get itemName(): ItemName;
    inventoryLeftClick(player: Player): void;
}
