import * as THREE from "three";

import { Renderable } from "../Renderable";
import { Model } from "./Model";
import { BasicModel } from "./BasicModel";

export class Actor {
  private _shouldRemove = false;

  private model: Model;

  constructor(private unit: Renderable, private lifecycleCheck: () => boolean) {
    this.model = unit.create3dModel() || BasicModel.forRenderable(unit);
  }

  draw(scene: THREE.Scene, tickPercent: number) {
    if (this._shouldRemove) {
      return;
    }
    const worldLocation = this.unit.getPerceivedLocation(tickPercent);
    this.model.draw(scene, tickPercent, worldLocation);
    this._shouldRemove = this.lifecycleCheck();
  }

  shouldRemove() {
    return this._shouldRemove;
  }

  getModel() {
    return this.model;
  }

  destroy(scene: THREE.Scene) {
    this.model.destroy(scene);
  }
}
