import ColorScale from "color-scales";
import { PlayerStats } from "./PlayerStats";
declare enum MapHover {
    NONE = 0,
    HITPOINT = 1,
    PRAYER = 2,
    RUN = 3,
    SPEC = 4,
    XP = 5
}
export declare class MapController {
    static controller: MapController;
    colorScale: ColorScale;
    outlineImage: HTMLImageElement;
    mapAlphaImage: HTMLImageElement;
    mapNumberOrb: HTMLImageElement;
    mapSelectedNumberOrb: HTMLImageElement;
    mapHitpointOrb: HTMLImageElement;
    mapPrayerOrb: HTMLImageElement;
    mapPrayerSelectedOrb: HTMLImageElement;
    mapRunOrb: HTMLImageElement;
    mapNoSpecOrb: HTMLImageElement;
    mapSpecOrb: HTMLImageElement;
    mapSpecOnOrb: HTMLImageElement;
    mapHitpointIcon: HTMLImageElement;
    mapPrayerIcon: HTMLImageElement;
    mapWalkIcon: HTMLImageElement;
    mapRunIcon: HTMLImageElement;
    mapStamIcon: HTMLImageElement;
    mapSpecIcon: HTMLImageElement;
    mapXpButton: HTMLImageElement;
    mapXpHoverButton: HTMLImageElement;
    mapCanvas: OffscreenCanvas;
    compassImage: OffscreenCanvas;
    mapHitpointOrbMasked: OffscreenCanvas;
    mapPrayerOrbMasked: OffscreenCanvas;
    mapRunOrbMasked: OffscreenCanvas;
    mapSpecOrbMasked: OffscreenCanvas;
    currentStats: PlayerStats;
    stats: PlayerStats;
    hovering: MapHover;
    width: number;
    height: number;
    constructor();
    updateOrbsMask(currentStats: PlayerStats, stats: PlayerStats): void;
    loadImages(): void;
    generateMaskedMap(): void;
    cursorMovedTo(event: MouseEvent): void;
    rightClick(event: MouseEvent): boolean;
    leftClickDown(event: MouseEvent): boolean;
    canSpecialAttack(): boolean;
    toggleSpecialAttack(): void;
    toggleQuickprayers(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
export {};
