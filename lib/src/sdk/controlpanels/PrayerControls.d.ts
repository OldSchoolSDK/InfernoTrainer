import { BaseControls } from "./BaseControls";
import { ControlPanelController } from "../ControlPanelController";
export declare class PrayerControls extends BaseControls {
    hasQuickPrayersActivated: boolean;
    get panelImageReference(): string;
    get tabImageReference(): string;
    get keyBinding(): string;
    deactivateAllPrayers(): void;
    activateQuickPrayers(): void;
    panelClickDown(x: number, y: number): void;
    get isAvailable(): boolean;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
