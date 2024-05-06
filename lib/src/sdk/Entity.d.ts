import { Location } from "./Location";
import { UnitTypes } from "./Unit";
import { EntityName } from "./EntityName";
import { Region } from "./Region";
import { CollisionType } from "./Collision";
import { LineOfSightMask } from "./LineOfSight";
import { Renderable } from "./Renderable";
export declare class Entity extends Renderable {
    region: Region;
    location: Location;
    dying: number;
    _serialNumber: string;
    get serialNumber(): string;
    get selectable(): boolean;
    shouldDestroy(): boolean;
    get size(): number;
    isDying(): boolean;
    get collisionType(): CollisionType;
    get lineOfSight(): LineOfSightMask;
    isOnTile(x: number, y: number): boolean;
    getClosestTileTo(x: number, y: number): number[];
    entityName(): EntityName;
    constructor(region: Region, location: Location);
    getPerceivedLocation(tickPercent: number): {
        z: number;
        x: number;
        y: number;
    };
    getPerceivedRotation(): number;
    getTrueLocation(): Location;
    get color(): string;
    get type(): UnitTypes;
    tick(): void;
    drawUILayer(tickPercent: number, screenPosition: Location, context: OffscreenCanvasRenderingContext2D, scale: number, hitsplatAbove?: boolean): void;
    draw(tickPercent: number, context: OffscreenCanvasRenderingContext2D): void;
    get animationIndex(): number;
}
