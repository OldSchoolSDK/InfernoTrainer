import * as THREE from "three";

import { Model, Location } from "@supalosa/oldschool-trainer-sdk";

import { SolGroundSlam } from "../entities/SolGroundSlam";

const MAX_SLAMS_PER_TICK = 400;

// Instanced basic animated geometry cache. Maybe this should be a utility class.
export class GroundSlamModel implements Model {
  static forGroundSlam(r: SolGroundSlam, instanceTimestamp: number) {
    return new GroundSlamModel(r, instanceTimestamp);
  }

  // Map of instanceTimestamp -> InstancedMesh
  static instanceMap = new Map<number, THREE.InstancedMesh>();

  private mesh: THREE.InstancedMesh;

  private instance: THREE.Object3D;
  private index: number | null = null; // null = not initialised in matrix

  static createOrGetInstance(instanceTimestamp: number, size: number, color: number) {
    if (!this.instanceMap.has(instanceTimestamp)) {
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.33,
      });
      const geometry = new THREE.SphereGeometry(size / 2, 24, 24);
      this.instanceMap.set(instanceTimestamp, new THREE.InstancedMesh(geometry, material, MAX_SLAMS_PER_TICK));
    }
    const instancedMesh = this.instanceMap.get(instanceTimestamp);
    return instancedMesh;
  }

  // All instances with the same timestamp will share an InstancedGeometry.
  constructor(
    private groundSlam: SolGroundSlam,
    private instanceTimestamp: number,
  ) {
    this.mesh = GroundSlamModel.createOrGetInstance(instanceTimestamp, groundSlam.size, groundSlam.colorHex);
    this.instance = new THREE.Object3D();
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.mesh.parent !== scene) {
      scene.add(this.mesh);
      this.index = 0;
      this.mesh.count = 1;
    } else if (this.index === null) {
      this.index = this.mesh.count++;
    }
    const { x, y } = location;
    if (this.groundSlam.visible(tickPercent)) {
      this.instance.position.set(x + this.groundSlam.size / 2, -0.5, y - this.groundSlam.size / 2);
      const scale = this.groundSlam.getScale(tickPercent);
      this.instance.scale.set(scale, scale, scale);
    } else {
      this.instance.position.set(1000, 1000, 1000);
      this.instance.scale.set(0, 0, 0);
    }
    this.instance.updateMatrix();
    this.mesh.setMatrixAt(this.index, this.instance.matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.computeBoundingSphere();
    if (this.index === 0) {
      (this.mesh.material as THREE.MeshBasicMaterial).opacity = this.groundSlam.getAlpha(tickPercent);
    }
  }

  destroy(scene: THREE.Scene) {
    if (--this.mesh.count <= 0 && this.mesh.parent === scene) {
      this.mesh.dispose();
      GroundSlamModel.instanceMap.delete(this.instanceTimestamp);
      scene.remove(this.mesh);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.mesh.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    //
  }
}
