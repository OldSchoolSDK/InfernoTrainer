import { ItemName } from "../../sdk/ItemName";
import { Player } from "../../sdk/Player";
import { Potion } from "../../sdk/gear/Potion";
export declare class BastionPotion extends Potion {
    oneDose: HTMLImageElement;
    twoDose: HTMLImageElement;
    threeDose: HTMLImageElement;
    fourDose: HTMLImageElement;
    constructor(doses?: number);
    get inventoryImage(): string;
    get itemName(): ItemName;
    drink(player: Player): void;
    updateInventorySprite(): void;
}
