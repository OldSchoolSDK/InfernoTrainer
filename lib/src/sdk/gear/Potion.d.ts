import { Item } from "../Item";
import { Player } from "../Player";
export declare class Potion extends Item {
    inventorySprite: HTMLImageElement;
    vial: HTMLImageElement;
    doses: number;
    constructor();
    drink(player: Player): void;
    get weight(): number;
    updateInventorySprite(): void;
    get hasInventoryLeftClick(): boolean;
    inventoryLeftClick(player: Player): void;
}
