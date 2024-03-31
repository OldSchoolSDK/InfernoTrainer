"use strict";
import { World } from "./World";
import { ViewportDelegate } from "./Viewport";
import { Region } from "./Region";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Chrome } from "./Chrome";
import { Settings } from "./Settings";
import { update } from "lodash";

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;

  private canvasDimensions: { width: number; height: number } =
    this.calculateCanvasDimensions();

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(5));

    this.canvas = new OffscreenCanvas(
      this.canvasDimensions.width,
      this.canvasDimensions.height
    );

    this.initScene();

    this.camera = new THREE.PerspectiveCamera(
      90,
      this.canvasDimensions.width / this.canvasDimensions.height,
      0.1,
      1000
    );
    this.camera.position.set(0.8, 1.4, 1.0);
    const worldCanvas = document.getElementById("world") as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.controls = new OrbitControls(this.camera, worldCanvas);
    this.controls.mouseButtons = {
      MIDDLE: THREE.MOUSE.ROTATE,
    };
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);

    this.animate();
  }

  calculateCanvasDimensions() {
    const { width, height } = Chrome.size();

    const visibleWidth = width - (Settings.menuVisible ? 232 : 0);

    return { width: visibleWidth, height };
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    this.render();
  }

  initScene() {
    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);
  }

  draw(world: World, region: Region) {
    region.context.save();

    const newDimensions = this.calculateCanvasDimensions();
    if (newDimensions.width !== this.canvasDimensions.width) {
      this.canvas.width = newDimensions.width;
      this.canvas.height = newDimensions.height;
      this.camera.aspect = newDimensions.width / newDimensions.height;
      this.camera.updateProjectionMatrix();
      this.canvasDimensions = newDimensions;
    }

    region.context.restore();
    return {
      canvas: this.canvas,
      flip: false,
      offsetX: 0,
      offsetY: 0,
    };
  }
}
