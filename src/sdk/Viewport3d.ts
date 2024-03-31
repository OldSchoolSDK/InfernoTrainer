"use strict";
import { World } from "./World";
import { ViewportDelegate } from "./Viewport";
import { Region } from "./Region";

import * as THREE from "three";
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

  constructor(
    private unit: Renderable,
    userData: { clickable?: boolean } = { clickable: false }
  ) {
    this.geometry = new THREE.BoxGeometry(unit.size, unit.height, unit.size);
    this.material = new THREE.MeshStandardMaterial({ color: unit.colorHex });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.userData = {
      unit: this,
      ...userData,
    };
  }

  draw(scene: THREE.Scene, tickPercent: number) {
    if (this.cube.parent !== scene) {
      scene.add(this.cube);
    }
    const size = this.unit.size;
    const { x, y } = this.unit.getPerceivedLocation(tickPercent);

    this.cube.position.x = x + size / 2;
    this.cube.position.z = y - size / 2;
  }

  shouldRemove() {
    return false;
  }

  getMesh() {
    return this.cube;
  }
}

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;

  private canvasDimensions: { width: number; height: number } =
    this.calculateCanvasDimensions();

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private raycaster: THREE.Raycaster;

  private pivot = new THREE.Object3D();
  private yaw = new THREE.Object3D();
  private pitch = new THREE.Object3D();

  private knownActors: Map<Renderable, Model> = new Map();

  private selectedTile: Location | null = null;
  private selectedTileMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );

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
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;

    const worldCanvas = document.getElementById("world") as HTMLCanvasElement;
    this.initCameraEvents(worldCanvas);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    // Set up camera positioning
    this.camera.position.set(0, 3, 5);
    this.pivot.position.set(0, 0, 10);
    // Face south
    this.yaw.rotation.y = Math.PI;
    // Pitch down slightly
    this.pitch.rotation.x = -0.7;
    // Zoom out
    this.camera.position.z = 15;
    this.scene.add(this.pivot);
    this.pivot.add(this.yaw);
    this.yaw.add(this.pitch);
    this.pitch.add(this.camera);

    this.animate();
  }

  // implementation from https://codepen.io/seanwasere/pen/BaMBoPd
  onDocumentMouseMove(e: MouseEvent) {
    if ((e.buttons & 4) !== 4) return;
    this.yaw.rotation.y -= e.movementX * 0.002;
    const v = this.pitch.rotation.x - e.movementY * 0.002;
    if (v > -1 && v < 0.1) {
      this.pitch.rotation.x = v;
    }
    return false;
  }

  onDocumentMouseWheel(e: WheelEvent) {
    const v = this.camera.position.z + e.deltaY * 0.005;
    if (v >= 2 && v <= 20) {
      this.camera.position.z = v;
    }
    return false;
  }

  initCameraEvents(canvas) {
    canvas.addEventListener(
      "mousemove",
      this.onDocumentMouseMove.bind(this),
      false
    );
    canvas.addEventListener(
      "wheel",
      this.onDocumentMouseWheel.bind(this),
      false
    );
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

    this.scene.add(this.selectedTileMesh);
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
        actor = new Model(player, { clickable: false });
        this.knownActors.set(player, actor);
      }
      actor.draw(this.scene, world.tickPercent);

      // Move the camera to the player.
      const { x, y } = player.getPerceivedLocation(world.tickPercent);
      const newTarget = new THREE.Vector3(x + 0.5, 0, y - 0.5);

      // Update the camera position relative to the mesh
      const v = new THREE.Vector3();
      actor.getMesh().getWorldPosition(v);
      this.pivot.position.lerp(v, 0.1);
    });

    region.mobs.concat(region.newMobs).forEach((mob: Mob) => {
      let actor = this.knownActors.get(mob);
      if (!actor) {
        actor = new Model(mob);
        this.knownActors.set(mob, actor);
      }
      actor.draw(this.scene, world.tickPercent);
    });

    // highlight selected tile/npc
    if (this.selectedTile) {
      this.selectedTileMesh.position.x = this.selectedTile.x;
      this.selectedTileMesh.position.z = this.selectedTile.y;
    }

    region.context.restore();
    return {
      canvas: this.canvas,
      flip: false,
      offsetX: 0,
      offsetY: 0,
    };
  }

  translateClick(offsetX, offsetY, world, viewport) {
    // i can't tell you why this shouldn't be the canvas width/height but this works...
    const { width, height } = Chrome.size();
    const rayX = (offsetX / width) * 2 - 1;
    const rayY = -(offsetY / height) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(rayX, rayY), this.camera);
    const intersections = this.raycaster
      .intersectObjects(this.scene.children)
      .filter(
        (i) =>
          Object.keys(i.object.userData).length === 0 ||
          i.object.userData.clickable === true
      );
    const intersection = intersections.length > 0 ? intersections[0] : null;

    if (!intersection) {
      return null;
    }
    this.selectedTile = {
      x: Math.floor(intersection.point.x) + 0.5,
      y: Math.floor(intersection.point.z) + 0.5,
    };
    const mobs = intersections
      .filter((i) => i.object.userData.unit instanceof Mob)
      .map((i) => i.object.userData.unit as Mob);
    return {
      type: "entities" as const,
      mobs,
      players: [],
      groundItems: [],
    };
  }
}
