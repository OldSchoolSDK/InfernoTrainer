import { Weapon } from "./gear/Weapon";
import { Unit, UnitBonuses, UnitOptions, UnitStats, UnitTypes } from "./Unit";
import { Location } from "./Location";
import { Region } from "./Region";
import { Model } from "./rendering/Model";
export declare enum AttackIndicators {
    NONE = 0,
    HIT = 1,
    BLOCKED = 2,
    SCAN = 3
}
export interface WeaponsMap {
    [key: string]: Weapon;
}
export declare class Mob extends Unit {
    static mobIdTracker: number;
    mobId: number;
    hasResurrected: boolean;
    attackFeedback: AttackIndicators;
    stats: UnitStats;
    currentStats: UnitStats;
    hadLOS: boolean;
    hasLOS: boolean;
    weapons: WeaponsMap;
    attackStyle: string;
    tcc: Location[];
    removableWithRightClick: boolean;
    constructor(region: Region, location: Location, options?: UnitOptions);
    get type(): UnitTypes;
    canBeAttacked(): boolean;
    setStats(): void;
    get bonuses(): UnitBonuses;
    /**
     *
     * @returns the next location to move to
     */
    getNextMovementStep(): {
        dx: number;
        dy: number;
    };
    movementStep(): void;
    getXMovementTiles(xOff: number, yOff: number): any[];
    getYMovementTiles(xOff: number, yOff: number): any[];
    canMeleeIfClose(): "slash" | "crush" | "stab" | "";
    attackStep(): void;
    attackStyleForNewAttack(): string;
    attackIfPossible(): void;
    magicMaxHit(): number;
    attack(): boolean;
    visible(): boolean;
    get consumesSpace(): Unit;
    get combatLevel(): number;
    contextActions(region: Region, x: number, y: number): {
        text: {
            text: string;
            fillStyle: string;
        }[];
        action: () => void;
    }[];
    drawOverTile(tickPercent: number, context: OffscreenCanvasRenderingContext2D, scale: any): void;
    drawUnderTile(tickPercent: number, context: OffscreenCanvasRenderingContext2D, scale: any): void;
    draw(tickPercent: number, context: OffscreenCanvasRenderingContext2D, offset: Location, scale: number, drawUnderTile: boolean): void;
    drawUILayer(tickPercent: any, offset: any, context: any, scale: any, hitsplatsAbove: any): void;
    create3dModel(): Model;
    get color(): string;
}
