import { BaseControls } from "./BaseControls";
import { ControlPanelController } from "../ControlPanelController";
import { EquipmentTypes } from "../Equipment";
export declare class EquipmentControls extends BaseControls {
    static instance: EquipmentControls | null;
    constructor();
    usedSpotBackground: HTMLImageElement;
    private DEFAULT_EQUIPMENT_INTERACTIONS;
    equipmentInteractions: ((slot: EquipmentTypes) => void)[];
    private clickedSlot;
    resetEquipmentInteractions(): void;
    addEquipmentInteraction(interaction: (slot: EquipmentTypes) => void): void;
    get panelImageReference(): string;
    get tabImageReference(): string;
    get keyBinding(): string;
    panelClickDown(x: number, y: number): void;
    panelClickUp(): void;
    private unequipItem;
    get isAvailable(): boolean;
    get appearsOnLeftInMobile(): boolean;
    drawEquipment(context: OffscreenCanvasRenderingContext2D, x: number, y: number, slotX: number, slotY: number, scale: number, slot: EquipmentTypes): void;
    draw(context: any, ctrl: ControlPanelController, x: number, y: number): void;
}
