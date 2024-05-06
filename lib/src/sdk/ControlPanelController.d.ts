import { AncientsSpellbookControls } from "./controlpanels/AncientsSpellbookControls";
import { BaseControls } from "./controlpanels/BaseControls";
import { CombatControls } from "./controlpanels/CombatControls";
import { EquipmentControls } from "./controlpanels/EquipmentControls";
import { InventoryControls } from "./controlpanels/InventoryControls";
import { PrayerControls } from "./controlpanels/PrayerControls";
import { StatsControls } from "./controlpanels/StatsControls";
import { Location } from "./Location";
interface TabPosition {
    x: number;
    y: number;
}
export declare class ControlPanelController {
    static controls: Readonly<{
        COMBAT: CombatControls;
        INVENTORY: InventoryControls;
        PRAYER: PrayerControls;
        EQUIPMENT: EquipmentControls;
        STATS: StatsControls;
        ANCIENTSSPELLBOOK: AncientsSpellbookControls;
    }>;
    static controller: ControlPanelController;
    desktopControls: BaseControls[];
    mobileControls: BaseControls[];
    controls: BaseControls[];
    selectedControl: BaseControls;
    width: number;
    height: number;
    private boostPanel;
    isUsingExternalUI: boolean;
    constructor();
    getTabScale(): number;
    boostPosition(): {
        x: number;
        y: number;
    };
    tabPosition(i: number): TabPosition;
    cursorMovedTo(e: MouseEvent): void;
    controlPanelRightClick(e: MouseEvent): boolean;
    controlPanelClickUp(e: MouseEvent): boolean;
    controlPanelClickDown(e: MouseEvent): boolean;
    controlPosition(control: BaseControls): Location;
    onWorldTick(): void;
    draw(context: CanvasRenderingContext2D): void;
}
export {};
