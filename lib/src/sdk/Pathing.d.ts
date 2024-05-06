import { Location } from "./Location";
import { Region } from "./Region";
import { Unit } from "./Unit";
interface PathingCache {
    [key: string]: boolean;
}
export declare class Pathing {
    static entitiesAtPoint(region: Region, x: number, y: number, s: number): any[];
    static mobsAtAoeOffset(region: Region, mob: Unit, point: Location): any[];
    static linearInterpolation(x: number, y: number, a: number): number;
    static dist(x: number, y: number, x2: number, y2: number): number;
    static angle(x: number, y: number, x2: number, y2: number): number;
    static closestPointTo(x: number, y: number, mob: Unit): any;
    static tileCache: PathingCache;
    static purgeTileCache(): void;
    static canTileBePathedTo(region: Region, x: number, y: number, s: number, mobToAvoid?: Unit): boolean;
    /**
     *
     * @param region
     * @param startPoint
     * @param endPoints array of valid end points. the first should be the SW tile.
     * @returns
     */
    static constructPaths(region: Region, { x, y }: Location, endPoints: Location[]): {
        destination: Location | null;
        path: Location[];
    };
    static path(region: Region, startPoint: Location, endPoint: Location, speed: number, seeking: Unit): {
        x: number;
        y: number;
        path: any[];
        destination?: undefined;
    } | {
        x: number;
        y: number;
        path: Location[];
        destination: Location;
    };
}
export {};
