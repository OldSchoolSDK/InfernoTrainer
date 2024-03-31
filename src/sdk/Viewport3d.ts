"use strict";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { Region } from "./Region";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Chrome } from "./Chrome";
import { Settings } from "./Settings";
import { Player } from "./Player";
import { Mob } from "./Mob";
import { Entity } from "./Entity";
import { Renderable } from "./Renderable";
import { Location } from "./Location";

class Model {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;
  private cube: THREE.Mesh;

  constructor(private unit: Renderable) {
    this.geometry = new THREE.BoxGeometry(unit.size, unit.height, unit.size);
    this.material = new THREE.MeshStandardMaterial({ color: unit.colorHex });
    this.cube = new THREE.Mesh(this.geometry, this.material);
  }

  draw(scene: THREE.Scene, tickPercent: number) {
    if (this.cube.parent !== scene) {
      scene.add(this.cube);
    }
    const { x, y } = this.unit.getPerceivedLocation(tickPercent);

    this.cube.position.x = x;
    this.cube.position.z = y;
  }

  shouldRemove() {
    return false;
  }
}

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;

  private canvasDimensions: { width: number; height: number } =
    this.calculateCanvasDimensions();

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  private knownActors: Map<Renderable, Model> = new Map();

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
    this.camera.position.set(20, 30, 20);
    const worldCanvas = document.getElementById("world") as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    // TODO
    // https://stackoverflow.com/questions/53292145/forcing-orbitcontrols-to-navigate-around-a-moving-object-almost-working
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
    const light = new THREE.PointLight(0xffffff, 1400);
    light.position.set(30, 20, 30);
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 8, 8);
    floorGeometry.rotateX(-Math.PI / 2);
    floorGeometry.translate(0, -0.5, 0);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x996622,
      side: THREE.FrontSide,
    });
    const plane = new THREE.Mesh(floorGeometry, floorMaterial);
    this.scene.add(plane);
  }

  draw(world: World, region: Region) {
    region.context.save();

    // update canvas if necessary
    const newDimensions = this.calculateCanvasDimensions();
    if (newDimensions.width !== this.canvasDimensions.width) {
      this.canvas.width = newDimensions.width;
      this.canvas.height = newDimensions.height;
      this.camera.aspect = newDimensions.width / newDimensions.height;
      this.camera.updateProjectionMatrix();
      this.canvasDimensions = newDimensions;
    }

    // draw everthing
    region.entities.forEach((entity: Entity) => {
      let actor = this.knownActors.get(entity);
      if (!actor) {
        actor = new Model(entity);
        this.knownActors.set(entity, actor);
      }
      actor.draw(this.scene, world.tickPercent);
    });

    region.players.forEach((player: Player) => {
      let actor = this.knownActors.get(player);
      if (!actor) {
        actor = new Model(player);
        this.knownActors.set(player, actor);
      }
      actor.draw(this.scene, world.tickPercent);

      const { x, y } = player.getPerceivedLocation(world.tickPercent);
      this.controls.target.set(x, 0, y);
    });

    region.mobs.concat(region.newMobs).forEach((mob: Mob) => {
      let actor = this.knownActors.get(mob);
      if (!actor) {
        actor = new Model(mob);
        this.knownActors.set(mob, actor);
      }
      actor.draw(this.scene, world.tickPercent);
    });

    region.context.restore();
    return {
      canvas: this.canvas,
      flip: false,
      offsetX: 0,
      offsetY: 0,
    };
  }

  translateClick(offsetX, offsetY, world, viewport): Location {
    const { viewportX, viewportY } = viewport.getViewport(world.tickPercent);
    let x = offsetX + viewportX * Settings.tileSize;
    let y = offsetY + viewportY * Settings.tileSize;

    if (Settings.rotated === "south") {
      x =
        viewport.width * Settings.tileSize -
        offsetX +
        viewportX * Settings.tileSize;
      y =
        viewport.height * Settings.tileSize -
        offsetY +
        viewportY * Settings.tileSize;
    }
    return {
      x: viewportX,
      y: viewportY,
    };
  }
}
