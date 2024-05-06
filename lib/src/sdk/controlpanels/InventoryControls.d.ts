import { BaseControls } from "./BaseControls";
import { Item } from "../Item";
import { ControlPanelController } from "../ControlPanelController";
import { Location } from "../../sdk/Location";
export declare class InventoryControls extends BaseControls {
    clickedDownItem: Item;
    clickedDownLocation: Location;
    cursorLocation: Location;
    inventoryCache: Item[];
    get panelImageReference(): string;
    get tabImageReference(): string;
    get keyBinding(): string;
    cursorMovedto(x: number, y: number): void;
    get isAvailable(): boolean;
    get appearsOnLeftInMobile(): boolean;
    onWorldTick(): void;
    panelRightClick(x: number, y: number): void;
    panelClickUp(x: number, y: number): void;
    panelClickDown(x: number, y: number): void;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
