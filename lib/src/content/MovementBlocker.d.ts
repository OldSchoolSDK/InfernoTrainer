import { Entity } from "../sdk/Entity";
import { CollisionType } from "../sdk/Collision";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { Model } from "../sdk/rendering/Model";
export declare class InvisibleMovementBlocker extends Entity {
    get lineOfSight(): LineOfSightMask;
    get collisionType(): CollisionType;
    get size(): number;
    draw(): void;
    create3dModel(): Model;
}
