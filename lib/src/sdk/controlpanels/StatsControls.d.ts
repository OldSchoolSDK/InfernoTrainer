import { ControlPanelController } from "../ControlPanelController";
import { BaseControls } from "./BaseControls";
export declare class StatsControls extends BaseControls {
    get panelImageReference(): string;
    get tabImageReference(): string;
    get isAvailable(): boolean;
    levelPrompt(skill: string): number;
    panelClickUp(x: number, y: number): void;
    get appearsOnLeftInMobile(): boolean;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
