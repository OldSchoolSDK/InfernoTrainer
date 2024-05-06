import { Entity } from "./Entity";
import { Item } from "./Item";
import { Mob } from "./Mob";
import { Player } from "./Player";
import { World } from "./World";
import { Projectile } from "./weapons/Projectile";
interface GroundYItems {
    [key: number]: Item[];
}
export interface GroundItems {
    [key: number]: GroundYItems;
}
export declare enum CardinalDirection {
    NORTH = 0,
    SOUTH = 1
}
export declare abstract class Region {
    canvas: OffscreenCanvas;
    players: Player[];
    world: World;
    newMobs: Mob[];
    mobs: Mob[];
    entities: Entity[];
    projectiles: Projectile[];
    mapImage: HTMLImageElement;
    groundItems: GroundItems;
    _serialNumber: string;
    get serialNumber(): string;
    get initialFacing(): CardinalDirection;
    midTick(): void;
    postTick(): void;
    addPlayer(player: Player): void;
    rightClickActions(): any[];
    get context(): OffscreenCanvasRenderingContext2D;
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    addMob(mob: Mob): void;
    removeMob(mob: Mob): void;
    removePlayer(player: Player): void;
    addGroundItem(player: Player, item: Item, x: number, y: number): void;
    addProjectile(projectile: Projectile): void;
    removeProjectile(projectile: Projectile): void;
    getName(): string;
    get width(): number;
    get height(): number;
    mapImagePath(): string;
    drawWorldBackground(context: OffscreenCanvasRenderingContext2D, scale: number): void;
    drawDefaultFloor(): boolean;
    groundItemsAtLocation(x: number, y: number): Item[];
    removeGroundItem(item: Item, x: number, y: number): void;
    drawGroundItems(ctx: OffscreenCanvasRenderingContext2D): void;
    abstract initialiseRegion(): {
        player: Player;
    };
    getSidebarContent(): string;
    preload(): Promise<void>;
}
export {};
