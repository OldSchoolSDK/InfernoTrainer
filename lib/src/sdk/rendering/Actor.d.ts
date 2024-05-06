import * as THREE from "three";
import { Renderable } from "../Renderable";
import { Model } from "./Model";
export declare class Actor {
    private unit;
    private model;
    constructor(unit: Renderable);
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number): void;
    shouldRemove(): boolean;
    getModel(): Model | null;
    destroy(scene: THREE.Scene): void;
}
