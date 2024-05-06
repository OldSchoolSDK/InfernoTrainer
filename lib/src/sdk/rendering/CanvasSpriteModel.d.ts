import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
/**
 * Render the model using a sprite derived from the 2d representation of the renderable.
 */
export declare class CanvasSpriteModel implements Model {
    private renderable;
    static forRenderable(r: Renderable): CanvasSpriteModel;
    private sprite;
    private texture;
    private canvas;
    private context;
    private outline;
    private outlineMaterial;
    constructor(renderable: Renderable);
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location, rotation: number, pitch: number, visible: boolean): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
