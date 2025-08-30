import * as THREE from "three";

import { Model, Location } from "@supalosa/oldschool-trainer-sdk";

import { SolSandPool } from "../entities/SolSandPool";

const BEAM_HEIGHT = 5;

export class SandPoolModel implements Model {
  static forSandPool(r: SolSandPool) {
    return new SandPoolModel(r);
  }

  private material: THREE.MeshBasicMaterial;
  private circle: THREE.Mesh;
  private beamMaterial: THREE.MeshBasicMaterial;
  private beam: THREE.Mesh;

  constructor(private sandPool: SolSandPool, onTop = true) {
    const { size } = sandPool;
    this.material = new THREE.MeshBasicMaterial({
      color: sandPool.colorHex,
      side: THREE.FrontSide,
      transparent: true,
    });
    const geometry = new THREE.CircleGeometry(size / 2, 32);
    this.circle = new THREE.Mesh(geometry, this.material);
    this.circle.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    this.beamMaterial = new THREE.MeshBasicMaterial({
      color: sandPool.colorHex,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.5,
    });
    const beamGeometry = new THREE.CylinderGeometry(0.2, 0.2, BEAM_HEIGHT, 32);
    this.beam  = new THREE.Mesh(beamGeometry, this.beamMaterial);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.circle.parent !== scene) {
      scene.add(this.circle);
    }
    const { x, y } = location;
    this.circle.visible = this.sandPool.visible(tickPercent);
    this.material.opacity = this.sandPool.opacity(tickPercent);
    this.material.color.lerp(new THREE.Color(this.sandPool.colorHex), tickPercent);
    this.circle.position.x = x + this.sandPool.size / 2;
    this.circle.position.y = -0.49;
    this.circle.position.z = y - this.sandPool.size / 2;
    if (this.sandPool.age >= 3 && this.sandPool.age < 5 && this.beam.parent !== scene) {
      this.beam.position.x = x + this.sandPool.size / 2;
      this.beam.position.y = BEAM_HEIGHT / 2 - 0.5;
      this.beam.position.z = y - this.sandPool.size / 2;
      this.beamMaterial.opacity = this.sandPool.opacity(tickPercent) / 2;
      scene.add(this.beam);
    } else if (this.sandPool.age >= 5) {
      scene.remove(this.beam);
    }
  }

  destroy(scene: THREE.Scene) {
    if (this.circle.parent === scene) {
      scene.remove(this.circle);
    }
    if (this.beam.parent === scene) {
      scene.remove(this.beam);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.circle.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    // do nothing
    return;
  }
}
