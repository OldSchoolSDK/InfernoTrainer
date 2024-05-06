import { Item } from "../Item";
import { Player } from "../Player";
export declare class Food extends Item {
    healAmount: number;
    inventorySprite: HTMLImageElement;
    constructor();
    eat(player: Player): void;
    get weight(): number;
    updateInventorySprite(): void;
    get hasInventoryLeftClick(): boolean;
    inventoryLeftClick(player: Player): void;
}
