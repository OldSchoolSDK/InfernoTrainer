import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location3 } from "../Location";
export declare enum BasicModelShape {
    BOX = 0,
    SPHERE = 1
}
export declare class BasicModel implements Model {
    private size;
    private drawOffset;
    private shape;
    private geometry;
    private material;
    private mesh;
    static forRenderable(r: Renderable): BasicModel;
    static forRenderableCentered(r: Renderable): BasicModel;
    static sphereForRenderable(r: Renderable): BasicModel;
    constructor(size: number, height: number, color: number, unit: Renderable | null, drawOffset?: {
        x?: number;
        y?: number;
        z?: number;
    }, shape?: BasicModelShape);
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, rotation: number, pitch: number, visible: boolean): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
