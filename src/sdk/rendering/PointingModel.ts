import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location3 } from "../Location";

export class PointingModel implements Model {
  static forRenderable(r: Renderable) {
    return new PointingModel(r.size, r.height, r.colorHex, r);
  }

  private geometry: THREE.BufferGeometry;
  private material: THREE.MeshStandardMaterial;

  private arrowHelper: THREE.ArrowHelper;
  private mainMesh: THREE.Mesh;

  constructor(
    private size: number,
    height: number,
    color: number,
    unit: Renderable | null,
    private drawOffset: { x?: number; y?: number; z?: number } = {},
  ) {
    this.geometry = new THREE.BoxGeometry(size * 0.6, height, size * 0.6);
    this.material = new THREE.MeshStandardMaterial({ color });
    this.mainMesh = new THREE.Mesh(this.geometry, this.material);
    this.mainMesh.userData.clickable = unit !== null && unit.selectable;
    this.mainMesh.userData.unit = unit;

    // west is 0 degrees
    this.arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, color);
    this.mainMesh.add(this.arrowHelper);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, rotation: number) {
    if (this.mainMesh.parent !== scene) {
      scene.add(this.mainMesh);
    }
    const size = this.size;
    const { x, y, z } = location;

    // conversion from Location3 to Vector3
    // lerp because we only move the perceived location in client ticks
    const targetPosition = new THREE.Vector3(x + size / 2, z, y - size / 2).add({
      x: this.drawOffset.x || 0,
      y: this.drawOffset.y || 0,
      z: this.drawOffset.z || 0,
    });
    this.mainMesh.position.lerp(targetPosition, 0.25);

    this.mainMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
  }

  destroy(scene: THREE.Scene) {
    if (this.mainMesh.parent === scene) {
      scene.remove(this.mainMesh);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.mainMesh.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    // do nothing
    return;
  }
}
