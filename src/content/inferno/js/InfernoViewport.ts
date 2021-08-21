
import { Settings } from '../../../sdk/Settings';
import { Viewport } from '../../../sdk/Viewport';
import { World } from '../../../sdk/World';
import { InfernoRegion } from './InfernoRegion';

export class InfernoViewport extends Viewport {

  constructor(world: World) {
    super(world);
  }

  getViewport(world: World) {
    const infernoRegion = world.region as InfernoRegion;
    if ((infernoRegion.wave < 67 || infernoRegion.wave >=70) && Settings.lockPOV === true) {
      return { viewportX: 11, viewportY: 14 };
    }
    return super.getViewport(world);
  }
}