import * as THREE from "three";

import { Model, Location } from "@supalosa/oldschool-trainer-sdk";

import { SolarFlareOrb } from "../entities/SolarFlareOrb";


export class SolarFlareModel implements Model {
  static forSolarFlare(r: SolarFlareOrb) {
    return new SolarFlareModel(r);
  }

  private material: THREE.MeshBasicMaterial;
  private sphere: THREE.Mesh;

  private outline: THREE.LineSegments;

  constructor(
    private solarFlare: SolarFlareOrb,
    onTop = true,
  ) {
    const { size } = solarFlare;
    this.material = new THREE.MeshBasicMaterial({
      color: solarFlare.colorHex,
      side: THREE.FrontSide,
      transparent: true,
    });
    const geometry = new THREE.SphereGeometry(size * 0.4, 24, 24);
    this.sphere = new THREE.Mesh(geometry, this.material);
    this.sphere.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: solarFlare.colorHex,
      linewidth: 2,
    });
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(size, 0, 0),
      new THREE.Vector3(size, 0, 0),
      new THREE.Vector3(size, 0, -size),
      new THREE.Vector3(size, 0, -size),
      new THREE.Vector3(0, 0, -size),
      new THREE.Vector3(0, 0, -size),
      new THREE.Vector3(0, 0, 0),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    this.outline = new THREE.LineSegments(lineGeometry, lineMaterial);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.sphere.parent !== scene) {
      scene.add(this.sphere);
      scene.add(this.outline);
    }
    const { x, y } = location;
    this.sphere.visible = this.solarFlare.visible(tickPercent);
    this.material.opacity = this.solarFlare.opacity(tickPercent);
    this.material.color.lerp(new THREE.Color(this.solarFlare.colorHex), tickPercent);
    this.sphere.position.x = x + this.solarFlare.size / 2;
    this.sphere.position.y = 0;
    this.sphere.position.z = y - this.solarFlare.size / 2;

    this.outline.position.x = this.solarFlare.location.x;
    this.outline.position.y = -0.49;
    this.outline.position.z = this.solarFlare.location.y;
  }

  destroy(scene: THREE.Scene) {
    if (this.sphere.parent === scene) {
      scene.remove(this.sphere);
      scene.remove(this.outline);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.sphere.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    //
  }
}
