import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
export declare class TileMarkerModel implements Model {
    private renderable;
    static forRenderable(r: Renderable, onTop?: boolean): TileMarkerModel;
    private outline;
    constructor(renderable: Renderable, onTop?: boolean);
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
