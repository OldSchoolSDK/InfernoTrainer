import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
import { drawLineOnTop } from "./RenderUtils";

export class TileMarkerModel implements Model {
  static forRenderable(r: Renderable, renderOrder: number | null = 1) {
    return new TileMarkerModel(r, renderOrder);
  }

  private outline: THREE.LineSegments;
  private lineMaterial: THREE.LineBasicMaterial;

  constructor(private renderable: Renderable, renderOrder: number | null) {
    const { size } = renderable;
    this.lineMaterial = new THREE.LineBasicMaterial({
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
    this.outline = new THREE.LineSegments(geometry, this.lineMaterial);
    if (renderOrder !== null) {
      drawLineOnTop(this.outline, renderOrder);
    }
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.outline.parent !== scene) {
      scene.add(this.outline);
    }
    const { x, y } = location;
    this.outline.visible = this.renderable.visible(tickPercent);
    this.outline.position.x = x;
    this.outline.position.y = -0.49;
    this.outline.position.z = y;
    this.lineMaterial.color.setHex(this.renderable.colorHex);
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
