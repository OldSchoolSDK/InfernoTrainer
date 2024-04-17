import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";

export class EmptyModel implements Model {
  static forRenderable(r: Renderable) {
    return new EmptyModel();
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    // do nothing
  }

  destroy(scene: THREE.Scene) {
    // do nothing
  }

  getWorldPosition(): THREE.Vector3 {
    return new THREE.Vector3(0, 0, 0);
  }

  async preload() {
    // do nothing
    return;
  }
}
