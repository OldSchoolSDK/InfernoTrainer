import * as THREE from "three";
import { Location3 } from "../Location";
export interface Model {
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, angleRadians: number, pitchRadians: number, visible: boolean, modelOffsets: Location3[]): any;
    destroy(scene: THREE.Scene): any;
    getWorldPosition(): THREE.Vector3;
    preload(): Promise<void>;
}
