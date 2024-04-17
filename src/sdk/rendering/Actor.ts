import * as THREE from "three";

import { Renderable } from "../Renderable";
import { Model } from "./Model";

export class Actor {
  private model: Model;

  constructor(private unit: Renderable) {
    this.model = unit.get3dModel();
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number) {
    if (!this.unit.visible || !this.model) {
      return;
    }
    const worldLocation = this.unit.getPerceivedLocation(tickPercent);
    const rotationRadians = this.unit.getPerceivedRotation(tickPercent);
    this.model.draw(scene, clockDelta, tickPercent, worldLocation, rotationRadians);
  }

  shouldRemove() {
    return this.unit.shouldDestroy();
  }

  getModel(): Model | null {
    return this.model;
  }

  destroy(scene: THREE.Scene) {
    this.model?.destroy(scene);
  }
}
