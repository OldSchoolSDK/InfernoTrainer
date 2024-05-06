import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location3 } from "../Location";
export declare class PointingModel implements Model {
    private size;
    private drawOffset;
    static forRenderable(r: Renderable): PointingModel;
    private geometry;
    private material;
    private arrowHelper;
    private mainMesh;
    constructor(size: number, height: number, color: number, unit: Renderable | null, drawOffset?: {
        x?: number;
        y?: number;
        z?: number;
    });
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, pitch: number, rotation: number): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
