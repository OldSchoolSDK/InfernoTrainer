import * as THREE from "three";
import { Model } from "./Model";
import { Renderable } from "../Renderable";
import { Location } from "../Location";
import { drawLineNormally, drawLineOnTop } from "./RenderUtils";

const CANVAS_TILE_SIZE = 20;

const OUTLINE_NORMAL = 0xffffff;
const OUTLINE_SELECTED = 0xff0000;

/**
 * Render the model using a sprite derived from the 2d representation of the renderable.
 */
export class CanvasSpriteModel implements Model {
  static forRenderable(r: Renderable) {
    return new CanvasSpriteModel(r);
  }

  private sprite: THREE.Sprite;
  private texture: THREE.Texture;

  private canvas: OffscreenCanvas;
  private context: OffscreenCanvasRenderingContext2D;

  private outline: THREE.LineSegments;
  private outlineMaterial: THREE.LineBasicMaterial;

  constructor(private renderable: Renderable) {
    const { size } = renderable;
    this.canvas = new OffscreenCanvas(size * CANVAS_TILE_SIZE, size * CANVAS_TILE_SIZE);
    this.context = this.canvas.getContext("2d");
    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;
    this.texture.colorSpace = THREE.LinearSRGBColorSpace;
    const material = new THREE.SpriteMaterial({
      alphaTest: 0.5,
      map: this.texture,
      transparent: true,
      color: 0xffffff,
    });

    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(size, size, size);
    // trial and error to get the sprite to sit on top of the tile. could probably be set per-mob
    this.sprite.center.y = 0.075;
    this.sprite.userData.clickable = renderable.selectable;
    this.sprite.userData.unit = renderable;

    this.outlineMaterial = new THREE.LineBasicMaterial({
      color: OUTLINE_NORMAL,
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
    this.outline = new THREE.LineSegments(geometry, this.outlineMaterial);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.sprite.parent !== scene) {
      scene.add(this.sprite);
      scene.add(this.outline);
    }
    const size = this.renderable.size;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderable.draw(
      tickPercent,
      this.context,
      { x: 0, y: size - 1 },
      CANVAS_TILE_SIZE,
      false, // do not draw under-tile
    );
    this.texture.needsUpdate = true;

    this.outlineMaterial.color.setHex(this.renderable.selected ? OUTLINE_SELECTED : OUTLINE_NORMAL);
    if (this.renderable.selected) {
      drawLineOnTop(this.outline);
    } else {
      drawLineNormally(this.outline);
    }

    const { x, y } = location;
    this.outline.position.x = x;
    this.outline.position.y = -0.49;
    this.outline.position.z = y;
    this.sprite.position.x = x + size / 2;
    this.sprite.position.y = -0.5;
    this.sprite.position.z = y - size / 2;
  }

  destroy(scene: THREE.Scene) {
    if (this.sprite.parent === scene) {
      scene.remove(this.sprite);
      scene.remove(this.outline);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.sprite.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    // do nothing
    return;
  }
}
