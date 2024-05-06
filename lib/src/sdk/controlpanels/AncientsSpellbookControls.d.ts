import { BaseControls } from "./BaseControls";
import { ControlPanelController } from "../ControlPanelController";
export declare class AncientsSpellbookControls extends BaseControls {
    get panelImageReference(): string;
    get tabImageReference(): string;
    get keyBinding(): string;
    get isAvailable(): boolean;
    panelClickDown(x: number, y: number): void;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
