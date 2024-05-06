import { World } from "./World";
import { ViewportDelegate } from "./Viewport";
import { CardinalDirection, Region } from "./Region";
import * as THREE from "three";
import { Mob } from "./Mob";
export declare class Viewport3d implements ViewportDelegate {
    private canvas;
    private uiCanvas;
    private uiCanvasContext;
    private canvasDimensions;
    scene: THREE.Scene;
    private renderer;
    private camera;
    private raycaster;
    private pivot;
    private yaw;
    private pitch;
    private yawDelta;
    private pitchDelta;
    private stats;
    private knownActors;
    private selectedTile;
    private selectedTileMesh;
    private clock;
    constructor(faceCameraSouth?: boolean);
    checkGpu(): void;
    onDocumentMouseMove(e: MouseEvent): boolean;
    onDocumentMouseWheel(e: WheelEvent): boolean;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
    initCameraEvents(canvas: any): void;
    calculateCanvasDimensions(): {
        width: number;
        height: number;
    };
    render(): void;
    animate(): void;
    initialise(world: World, region: Region): Promise<void>;
    private updateCanvasSize;
    draw(world: World, region: Region): {
        canvas: OffscreenCanvas;
        uiCanvas: OffscreenCanvas;
        flip: boolean;
        offsetX: number;
        offsetY: number;
    };
    updateCamera(delta: number): void;
    draw3dScene(world: World, region: Region): void;
    draw2dScene(world: World, region: Region): void;
    projectToScreen(vector: THREE.Vector3): {
        x: number;
        y: number;
    };
    translateClick(offsetX: any, offsetY: any, world: any, viewport: any): {
        type: "entities";
        mobs: Mob[];
        players: any[];
        groundItems: any[];
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
    setMapRotation(direction: CardinalDirection): void;
    getMapRotation(): number;
}
