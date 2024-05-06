import { ClickController } from "./ClickController";
import { Player } from "./Player";
import { ContextMenu } from "./ContextMenu";
import { World } from "./World";
import { CardinalDirection, Region } from "./Region";
import { Location } from "./Location";
import { Mob } from "./Mob";
import { Item } from "./Item";
type ViewportEntitiesClick = {
    type: "entities";
    mobs: Mob[];
    players: Player[];
    groundItems: Item[];
    location: Location;
};
type ViewportCoordinateClick = {
    type: "coordinate";
    location: Location;
};
type ViewportClickResult = ViewportEntitiesClick | ViewportCoordinateClick | null;
type ViewportDrawResult = {
    canvas: OffscreenCanvas;
    uiCanvas: OffscreenCanvas | null;
    flip: boolean;
    offsetX: number;
    offsetY: number;
};
export interface ViewportDelegate {
    initialise(world: World, region: Region): Promise<void>;
    draw(world: World, region: Region): ViewportDrawResult;
    translateClick(offsetX: number, offsetY: number, world: World, viewport: Viewport): ViewportClickResult;
    getMapRotation(): number;
    setMapRotation(direction: CardinalDirection): any;
}
export declare class Viewport {
    private delegate;
    static viewport: Viewport;
    static setupViewport(region: Region, force2d?: boolean): void;
    activeButtonImage: HTMLImageElement;
    contextMenu: ContextMenu;
    clickController: ClickController;
    canvas: HTMLCanvasElement;
    player: Player;
    width: number;
    height: number;
    constructor(delegate: ViewportDelegate);
    /**
     * Return all objects or world coordinates at the given position (relative to the top-left of the viewport).
     */
    translateClick(offsetX: number, offsetY: number, world: World): ViewportClickResult;
    get context(): CanvasRenderingContext2D;
    setPlayer(player: Player): void;
    initialise(): Promise<void>;
    calculateViewport(): void;
    getViewport(tickPercent: number): {
        viewportX: number;
        viewportY: number;
    };
    drawText(text: string, x: number, y: number): void;
    tick(): void;
    getMapRotation(): number;
    rotateSouth(): void;
    rotateNorth(): void;
    getDelegate(): ViewportDelegate;
    draw(world: World): void;
}
export {};
