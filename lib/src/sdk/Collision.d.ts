import { LineOfSightMask } from "./LineOfSight";
import { Mob } from "./Mob";
import { Player } from "./Player";
import { Region } from "./Region";
import { Unit } from "./Unit";
export declare enum CollisionType {
    NONE = 0,
    BLOCK_MOVEMENT = 1
}
export declare class Collision {
    static collisionMath(x: number, y: number, s: number, x2: number, y2: number, s2: number): boolean;
    static collisionMathInclusive(x: number, y: number, s: number, x2: number, y2: number, s2: number): boolean;
    static collidesWithMob(region: Region, x: number, y: number, s: number, mob: Unit): boolean;
    static collidesWithAnyMobs(region: Region, x: number, y: number, s: number, mobToAvoid?: Unit): Mob;
    static collideableEntitiesAtPoint(region: Region, x: number, y: number, s: number): any[];
    static collidesWithAnyEntities(region: Region, x: number, y: number, s: number): boolean;
    static collidesWithAnyLoSBlockingEntities(region: Region, x: number, y: number, s: number): LineOfSightMask;
    static collidesWithAnyMobsAtPerceivedDisplayLocation(region: Region, x: number, y: number, tickPercent: number): Mob[];
    static collidesWithUnitAtPerceivedDisplayLocation(x: number, y: number, tickPercent: number, unit: Unit): boolean;
    static collidesWithAnyPlayersAtPerceivedDisplayLocation(region: Region, x: number, y: number, tickPercent: number): Player[];
}
