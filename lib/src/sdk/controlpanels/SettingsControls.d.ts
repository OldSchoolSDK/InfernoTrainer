import { BaseControls } from "./BaseControls";
import { ControlPanelController } from "../ControlPanelController";
export declare class SettingsControls extends BaseControls {
    get panelImageReference(): string;
    get tabImageReference(): string;
    soundImage: HTMLImageElement;
    areaSoundImage: HTMLImageElement;
    disabledOverlay: HTMLImageElement;
    redUpImage: HTMLImageElement;
    greenDownImage: HTMLImageElement;
    activeButtonImage: HTMLImageElement;
    inactiveButtonImage: HTMLImageElement;
    infernoImage: HTMLImageElement;
    verzikImage: HTMLImageElement;
    xarpusImage: HTMLImageElement;
    inventoryImage: HTMLImageElement;
    spellbookImage: HTMLImageElement;
    prayerImage: HTMLImageElement;
    equipmentImage: HTMLImageElement;
    combatImage: HTMLImageElement;
    bindingKey?: string;
    constructor();
    get isAvailable(): boolean;
    get appearsOnLeftInMobile(): boolean;
    get keyBinding(): string;
    panelClickDown(x: number, y: number): void;
    drawToggle(context: CanvasRenderingContext2D, x: any, y: any, image: HTMLImageElement, value: boolean): void;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
