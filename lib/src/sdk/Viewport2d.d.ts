import { Player } from "./Player";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { CardinalDirection, Region } from "./Region";
import { Unit } from "./Unit";
import { Mob } from "./Mob";
import { Item } from "./Item";
export declare class Viewport2d implements ViewportDelegate {
    initialise(world: World, region: Region): Promise<void>;
    draw(world: World, region: Region): {
        canvas: OffscreenCanvas;
        uiCanvas: any;
        flip: boolean;
        offsetX: number;
        offsetY: number;
    };
    translateClick(offsetX: any, offsetY: any, world: World, viewport: Viewport): {
        type: "entities";
        mobs: Mob[];
        players: Player[];
        groundItems: Item[];
        location: {
            x: number;
            y: number;
        };
    } | {
        type: "coordinate";
        location: {
            x: number;
            y: number;
        };
        mobs?: undefined;
        players?: undefined;
        groundItems?: undefined;
    };
    drawIncomingProjectiles(unit: Unit, context: OffscreenCanvasRenderingContext2D, tickPercent: number, scale?: number): void;
    setMapRotation(direction: CardinalDirection): void;
    getMapRotation(): number;
}
