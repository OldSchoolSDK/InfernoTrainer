import { create } from "lodash";
import { Location, Location3 } from "./Location";

import { Model } from "./rendering/Model";

export interface RenderableListener {
  animationChanged(id: number, blend: boolean): Promise<void>;
  modelChanged();
}

const NIL_OFFSET: Location3[] = [{ x: 0, y: 0, z: 0 }];

export abstract class Renderable {
  private _selected = false;
  private cachedModel: Model | null = null;
  private animationChangeListener: RenderableListener | null = null;

  // in case the animation is set before animationChangeListener is set
  private queuedAnimationId = -1;

  abstract getPerceivedLocation(tickPercent: number): Location3;

  /**
   * return the angle of this renderable in radians, around the Z (up) axis.
   * West is zero degrees, and increasing values represent clockwise rotation.
   */
  abstract getPerceivedRotation(tickPercent: number): number;

  abstract getTrueLocation(): Location;

  /**
   * return the pitch angle of this renderable in radians, i.e. how up/down it is pointing
   * 0 is flat, increasing is up, decreasing is down
   */
  getPerceivedPitch(tickPercent: number): number {
    return 0;
  }

  /**
   * allow offsetting the components of a multi-model renderable
   */
  getPerceivedOffsets(tickPercent: number): Location3[] {
    return NIL_OFFSET;
  }

  abstract get size(): number;

  get drawOutline(): boolean {
    return true;
  }

  get drawTrueTile(): boolean {
    return false;
  }

  get height(): number {
    return this.size;
  }

  get clickboxHeight(): number | null {
    return null;
  }

  get clickboxRadius(): number | null {
    return null;
  }

  abstract get color(): string;

  get colorHex() {
    return parseInt(this.color.replace("#", ""), 16);
  }

  get selectable(): boolean {
    return true;
  }

  visible(tickPercent): boolean {
    return true;
  }

  /**
   * Should remove from the scene
   */
  abstract shouldDestroy(): boolean;

  get selected(): boolean {
    return this._selected;
  }

  set selected(selected: boolean) {
    this._selected = selected;
  }
  
  drawUILayer(
    tickPercent: number,
    screenPosition: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number,
    hitsplatAbove = true,
  ) {
    // Override me
  }

  // draw in 2d mode
  draw(
    tickPercent: number,
    context: OffscreenCanvasRenderingContext2D,
    offset: Location = { x: 0, y: 0 },
    scale = 20,
    drawUnderTile = true,
  ) {
    // Override me
  }

  /**
   * Return a new model for this renderable in 3d mode. it will be associated with the Renderable and destroyed when the renderable is
   * destroyed.
   */
  protected create3dModel(): Model | null {
    return null;
  }

  public get3dModel(): Model | null {
    return this.cachedModel ?? this.create3dModel();
  }

  /**
   * Return the index of the animation that should be playing at this moment.
   * Note: if the value changes, the new animation will start upon the next tick.
   */
  abstract get animationIndex();

  async playAnimation(index: number, blend = false) {
    if (this.animationChangeListener) {
      return this.animationChangeListener.animationChanged(index, blend);
    } else {
      this.queuedAnimationId = index;
    }
  }

  setAnimationListener(listener: RenderableListener) {
    this.animationChangeListener = listener;
    if (this.queuedAnimationId >= 0) {
      listener.animationChanged(this.queuedAnimationId, false);
      this.queuedAnimationId = -1;
    }
  }

  clearAnimationListener() {
    this.animationChangeListener = null;
  }

  invalidateModel() {
    this.cachedModel = null;
    if (this.animationChangeListener) {
      this.animationChangeListener.modelChanged();
    }
  }

  async preload() {
    // Create an offscreen version of the model so that loading it is faster next time.
    this.cachedModel = this.create3dModel();
    if (this.cachedModel) {
      await this.cachedModel.preload();
    }
  }
}
