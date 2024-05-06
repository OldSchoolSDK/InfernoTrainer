import { ControlPanelController } from "../ControlPanelController";
export declare class BaseControls {
    panelImage: HTMLImageElement;
    tabImage: HTMLImageElement;
    selected: boolean;
    get keyBinding(): string;
    get isAvailable(): boolean;
    get panelImageReference(): string;
    get tabImageReference(): string;
    get appearsOnLeftInMobile(): boolean;
    cursorMovedto(x: number, y: number): void;
    panelRightClick(x: number, y: number): void;
    panelClickDown(x: number, y: number): void;
    panelClickUp(x: number, y: number): void;
    onWorldTick(): void;
    draw(context: CanvasRenderingContext2D, ctrl: ControlPanelController, x: number, y: number): void;
}
