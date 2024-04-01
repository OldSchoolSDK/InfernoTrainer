import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";

export class BasicModel implements Model {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;
  private cube: THREE.Mesh;

  static forRenderable(r: Renderable) {
    return new BasicModel(r.size, r.height, r.colorHex, r);
  }

  constructor(
    private size: number,
    height: number,
    color: number,
    unit: Renderable | null,
    private drawOffset: {x?: number , y?: number, z?: number} = {}
  ) {
    this.geometry = new THREE.BoxGeometry(size, height, size);
    this.material = new THREE.MeshStandardMaterial({ color });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.userData.clickable = unit !== null;
    this.cube.userData.unit = unit;
  }

  draw(scene: THREE.Scene, tickPercent: number, location: Location) {
    if (this.cube.parent !== scene) {
      scene.add(this.cube);
    }
    const size = this.size;
    const { x, y } = location;

    this.cube.position.x = x + size / 2;
    this.cube.position.z = y - size / 2;
    this.cube.position.add({x: this.drawOffset.x || 0, y: this.drawOffset.y || 0, z: this.drawOffset.z || 0});
  }

  destroy(scene: THREE.Scene) {
    if (this.cube.parent === scene) {
      scene.remove(this.cube);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.cube.getWorldPosition(new THREE.Vector3());
  }
}
