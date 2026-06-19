import * as THREE from "three";
import { Model } from "osrs-sdk";

export class InfernoPillarModel implements Model {
  private group = new THREE.Group();

  constructor() {
    const blackRock = new THREE.MeshStandardMaterial({ color: 0x171717 });
    const darkRock = new THREE.MeshStandardMaterial({ color: 0x24201d });
    const redRock = new THREE.MeshStandardMaterial({ color: 0x5a1b10 });
    const lavaRock = new THREE.MeshStandardMaterial({ color: 0x7a2a12 });

    // Small broken base, not a full chunky square
    this.addRock(1.9, 0.35, 1.8, 0, 0.15, 0, lavaRock, 0.2);
    this.addRock(1.6, 0.35, 1.5, -0.25, 0.45, 0.15, redRock, -0.4);

    // Main thin pillar body
    this.addRock(1.35, 1.3, 1.25, 0.05, 1.15, 0, darkRock, 0.1);
    this.addRock(1.15, 1.35, 1.1, -0.1, 2.15, 0.05, blackRock, -0.35);
    this.addRock(1.25, 1.25, 1.05, 0.1, 3.15, -0.05, blackRock, 0.45);

    // Top wider jagged bit
    this.addRock(1.8, 0.55, 1.5, -0.05, 4.05, 0, blackRock, 0.2);
    this.addRock(1.45, 0.45, 1.35, 0.15, 4.45, -0.05, blackRock, -0.25);

    // Small side lumps so it is not perfectly straight
    this.addRock(0.55, 0.7, 0.7, -0.85, 1.45, 0.1, redRock, 0.4);
    this.addRock(0.5, 0.65, 0.65, 0.8, 2.5, -0.05, darkRock, -0.5);
    this.addRock(0.55, 0.5, 0.7, -0.75, 3.4, 0.15, blackRock, 0.1);
  }

  private addRock(
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    material: THREE.MeshStandardMaterial,
    rotationY = 0,
  ) {
    // Low segment cylinder gives a rough OSRS-style rocky shape instead of a cube
    const geometry = new THREE.CylinderGeometry(
      width / 2,
      depth / 2,
      height,
      7,
    );

    const rock = new THREE.Mesh(geometry, material);
    rock.position.set(x, y, z);
    rock.rotation.y = rotationY;
    rock.rotation.x = 0.05;
    rock.rotation.z = -0.03;
    rock.castShadow = true;
    rock.receiveShadow = true;

    this.group.add(rock);
  }

  draw(
    scene: THREE.Scene,
    clockDelta: number,
    tickPercent: number,
    location: any,
    rotation: number,
    pitch: number,
    visible: boolean,
  ) {
    if (this.group.parent !== scene) {
      scene.add(this.group);
    }

    this.group.visible = visible;

    this.group.position.x = location.x + 1.5;
    this.group.position.y = location.z - 0.8;
    this.group.position.z = location.y - 1.5;

    this.group.rotation.y = rotation;
  }

  destroy(scene: THREE.Scene) {
    if (this.group.parent === scene) {
      scene.remove(this.group);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.group.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    return;
  }
}