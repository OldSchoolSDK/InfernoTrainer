import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
import { drawLineOnTop } from "./RenderUtils";

export class TileMarkerModel implements Model {
  static forRenderable(r: Renderable) {
    return new TileMarkerModel(r);
  }

  private outline: THREE.LineSegments;

  constructor(private renderable: Renderable) {
    const { size } = renderable;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: renderable.colorHex,
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
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.outline = new THREE.LineSegments(geometry, lineMaterial);
    drawLineOnTop(this.outline);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.outline.parent !== scene) {
      scene.add(this.outline);
    }
    const { x, y } = location;
    this.outline.position.x = x;
    this.outline.position.y = -0.49;
    this.outline.position.z = y;
  }

  destroy(scene: THREE.Scene) {
    if (this.outline.parent === scene) {
      scene.remove(this.outline);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.outline.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    // do nothing
    return;
  }
}
