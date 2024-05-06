import { Entity } from "../sdk/Entity";
import { CollisionType } from "../sdk/Collision";
export declare class Wall extends Entity {
    get collisionType(): CollisionType;
    get size(): number;
    draw(): void;
    get color(): string;
}
