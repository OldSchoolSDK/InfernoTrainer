import * as THREE from "three";

import { Location3 } from "../Location";

export interface Model {
  draw(scene: THREE.Scene, tickPercent: number, location: Location3);

  destroy(scene: THREE.Scene);

  getWorldPosition(): THREE.Vector3;
}
