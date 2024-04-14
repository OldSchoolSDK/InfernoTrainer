"use strict";
import { Entity } from "../sdk/Entity";

import { CollisionType } from "../sdk/Collision";
import { Model } from "../sdk/rendering/Model";
import { LineOfSightMask } from "../sdk/LineOfSight";
import { GLTFModel } from "../sdk/rendering/GLTFModel";
import { Assets } from "../sdk/utils/Assets";

// note: v1 has the rocks where zuk should be - we could use that in the future
export const InfernoSceneModel = Assets.getAssetUrl("models/scene-v3.glb");

export class InfernoScene extends Entity {
  get collisionType() {
    return CollisionType.NONE;
  }

  get size() {
    return 1;
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
    return new GLTFModel(this, [InfernoSceneModel], 1, -2.5, {
      x: -6.5,
      y: 12.5,
    });
  }
}
