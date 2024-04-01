import * as THREE from "three";

import { Location } from "../Location";

export interface Model {
  draw(scene: THREE.Scene, tickPercent: number, location: Location);

  destroy(scene: THREE.Scene);

  getWorldPosition(): THREE.Vector3;
}
