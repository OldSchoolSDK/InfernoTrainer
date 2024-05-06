import { Entity } from "../sdk/Entity";
import { CollisionType } from "../sdk/Collision";
import { Location } from "../sdk/Location";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { EntityName } from "../sdk/EntityName";
import { Region } from "../sdk/Region";
import { Model } from "../sdk/rendering/Model";
export declare class TileMarker extends Entity {
    private _color;
    _size: number;
    saveable: boolean;
    constructor(region: Region, location: Location, color: string, size?: number, saveable?: boolean);
    entityName(): EntityName;
    get collisionType(): CollisionType;
    get lineOfSight(): LineOfSightMask;
    get size(): number;
    get color(): string;
    draw(): void;
    create3dModel(): Model;
}
