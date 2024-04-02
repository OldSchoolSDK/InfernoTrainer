import * as THREE from "three";

import { Renderable } from "../Renderable";
import { Model } from "./Model";

export class Actor {
  private model: Model;

  constructor(private unit: Renderable) {
    this.model = unit.create3dModel();
  }

  draw(scene: THREE.Scene, tickPercent: number) {
    if (!this.unit.visible || !this.model) {
      return;
    }
    const worldLocation = this.unit.getPerceivedLocation(tickPercent);
    this.model.draw(scene, tickPercent, worldLocation);
  }

  shouldRemove() {
    return this.unit.shouldDestroy();
  }

  getModel() : Model | null {
    return this.model;
  }

  destroy(scene: THREE.Scene) {
    this.model?.destroy(scene);
  }
}
