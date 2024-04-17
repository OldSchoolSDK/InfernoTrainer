import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location, Location3 } from "../Location";

export enum BasicModelShape {
  BOX,
  SPHERE,
}

export class BasicModel implements Model {
  private geometry: THREE.BufferGeometry;
  private material: THREE.MeshStandardMaterial;
  private mesh: THREE.Mesh;

  static forRenderable(r: Renderable) {
    return new BasicModel(r.size, r.height, r.colorHex, r);
  }

  static forRenderableCentered(r: Renderable) {
    return new BasicModel(r.size, r.height, r.colorHex, r, {
      x: r.size / 2,
      z: -r.size / 2,
    });
  }

  // centered sphere
  static sphereForRenderable(r: Renderable) {
    return new BasicModel(r.size, r.height, r.colorHex, r, { x: r.size / 2, z: -r.size / 2 }, BasicModelShape.SPHERE);
  }

  constructor(
    private size: number,
    height: number,
    color: number,
    unit: Renderable | null,
    private drawOffset: { x?: number; y?: number; z?: number } = {},
    private shape: BasicModelShape = BasicModelShape.BOX,
  ) {
    this.geometry =
      shape === BasicModelShape.BOX
        ? new THREE.BoxGeometry(size, height, size)
        : new THREE.SphereGeometry(size / 2, 8, 8);
    this.material = new THREE.MeshStandardMaterial({ color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData.clickable = unit !== null && unit.selectable;
    this.mesh.userData.unit = unit;
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, rotation: number) {
    if (this.mesh.parent !== scene) {
      scene.add(this.mesh);
    }
    const size = this.size;
    const { x, y, z } = location;

    // conversion from Location3 to Vector3
    this.mesh.position.x = x + size / 2;
    this.mesh.position.y = z;
    this.mesh.position.z = y - size / 2;
    this.mesh.position.add({
      x: this.drawOffset.x || 0,
      y: this.drawOffset.y || 0,
      z: this.drawOffset.z || 0,
    });

    this.mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
  }

  destroy(scene: THREE.Scene) {
    if (this.mesh.parent === scene) {
      scene.remove(this.mesh);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.mesh.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    // do nothing
    return;
  }
}
