import { Region } from "./Region";
import { Player } from "./Player";
import { Unit } from "./Unit";
export declare enum LineOfSightMask {
    NONE = 0,
    FULL_MASK = 131072,
    EAST_MASK = 4096,
    WEST_MASK = 65536,
    NORTH_MASK = 1024,
    SOUTH_MASK = 16384
}
export declare class LineOfSight {
    static drawLOS(region: Region, x: number, y: number, s: number, r: number, c: string, isNPC: boolean): void;
    static mobHasLineOfSightOfPlayer(region: Region, player: Player, x: number, y: number, s: number, r?: number, isNPC?: boolean): boolean;
    static playerHasLineOfSightOfMob(region: Region, x: number, y: number, mob: Unit, r?: number): boolean;
    static mobHasLineOfSightToMob(region: Region, mob1: Unit, mob2: Unit, r?: number): boolean;
    static hasLineOfSight(region: Region, x1: number, y1: number, x2: number, y2: number, s?: number, r?: number, isNPC?: boolean): boolean;
}
