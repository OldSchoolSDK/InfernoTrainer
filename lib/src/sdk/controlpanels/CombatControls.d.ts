import { ControlPanelController } from "../ControlPanelController";
import { BaseControls } from "./BaseControls";
import { AttackStyle } from "../AttackStylesController";
import { Weapon } from "../gear/Weapon";
import { PlayerStats } from "../PlayerStats";
export declare class CombatControls extends BaseControls {
    private playerStats;
    selectedCombatStyleButtonImage: HTMLImageElement;
    combatStyleButtonImage: HTMLImageElement;
    autoRetailButtonImage: HTMLImageElement;
    selectedAutoRetailButtonImage: HTMLImageElement;
    specialAttackBarBackground: HTMLImageElement;
    get panelImageReference(): string;
    get tabImageReference(): string;
    get keyBinding(): string;
    updateStats(playerStats: PlayerStats): void;
    panelClickDown(x: number, y: number): void;
    get isAvailable(): boolean;
    drawAttackStyleButton(context: CanvasRenderingContext2D, weapon: Weapon, attackStyle: AttackStyle, attackStyleImage: HTMLImageElement, x: number, y: number): void;
    draw(context: CanvasRenderingContext2D, ctrl: ControlPanelController, x: number, y: number): void;
}
