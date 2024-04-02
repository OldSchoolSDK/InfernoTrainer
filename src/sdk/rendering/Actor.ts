import * as THREE from "three";

import { Renderable } from "../Renderable";
import { Model } from "./Model";
import { BasicModel } from "./BasicModel";

export class Actor {
  private model: Model;

  constructor(private unit: Renderable) {
    this.model = unit.create3dModel() || BasicModel.forRenderable(unit);
  }

  draw(scene: THREE.Scene, tickPercent: number) {
    if (!this.unit.visible) {
      return;
    }
    const worldLocation = this.unit.getPerceivedLocation(tickPercent);
    this.model.draw(scene, tickPercent, worldLocation);
  }

  shouldRemove() {
    return this.unit.shouldDestroy();
  }

  getModel() {
    return this.model;
  }

  destroy(scene: THREE.Scene) {
    this.model.destroy(scene);
  }
}
