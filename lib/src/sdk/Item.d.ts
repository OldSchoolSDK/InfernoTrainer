import { Location } from "./Location";
import { ItemName } from "./ItemName";
import { Player } from "./Player";
export declare class Item {
    groundLocation: Location;
    inventorySprite: HTMLImageElement;
    selected: boolean;
    defaultAction: string;
    _serialNumber: string;
    get serialNumber(): string;
    get hasInventoryLeftClick(): boolean;
    inventoryLeftClick(player: Player): void;
    contextActions(player: Player): {
        text: {
            text: string;
            fillStyle: string;
        }[];
        action: () => void;
    }[];
    get itemName(): ItemName;
    get weight(): number;
    inventoryPosition(player: Player): number;
    consumeItem(player: Player): void;
    get inventoryImage(): string;
}
