"use strict";

import { Assets, Entity, CollisionType, GLTFModel, Model, LineOfSightMask } from "@supalosa/oldschool-trainer-sdk";

const SceneModel = Assets.getAssetUrl("models/colosseum_partial.glb");
export class ColosseumScene extends Entity {
  get collisionType() {
    return CollisionType.NONE;
  }

  get size() {
    return 1;
  }

  get drawOutline() {
    return false;
  }

  draw() {
    // force empty draw
  }

  get color() {
    return "#222222";
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  getPerceivedRotation() {
    return -Math.PI / 2;
  }

  create3dModel(): Model {
    // one day we'll figure out the offsets used in the exporter...
    return new GLTFModel(this, [SceneModel], { scale: 1, verticalOffset: -11.2, 
      originOffset: {
      x: -6.5,
      y: 12.5,
    }});
  }
}
