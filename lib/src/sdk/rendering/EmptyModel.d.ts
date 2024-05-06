import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
export declare class EmptyModel implements Model {
    static forRenderable(r: Renderable): EmptyModel;
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
