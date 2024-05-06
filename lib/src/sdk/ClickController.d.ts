import { ClickAnimation } from "./ClickAnimation";
import { Unit } from "./Unit";
import { Viewport } from "./Viewport";
export declare class ClickController {
    clickAnimation?: ClickAnimation;
    viewport: Viewport;
    constructor(viewport: Viewport);
    eventListeners: ((e: MouseEvent) => void)[];
    unload(): void;
    registerClickActions(): void;
    wheel(e: WheelEvent): void;
    leftClickUp(e: MouseEvent): void;
    private recentlySelectedMobs;
    hasSelectedMob(): boolean;
    mouseMoved(e: MouseEvent): void;
    private getClickedOn;
    clickDown(e: MouseEvent): void;
    rightClickDown(e: MouseEvent): void;
    playerAttackClick(mob: Unit): void;
    playerWalkClick(x: number, y: number): void;
    redClick(): void;
    yellowClick(): void;
}
