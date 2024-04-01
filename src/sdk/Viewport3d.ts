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
import { BasicModel } from "./rendering/BasicModel";
import { Actor } from "./rendering/Actor";
import _ from "lodash";

// how many pixels wide should 2d elements be scaled to
const SPRITE_SCALE = 32;

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;
  private uiCanvas: OffscreenCanvas;
  private uiCanvasContext: OffscreenCanvasRenderingContext2D;

  private canvasDimensions: { width: number; height: number } =
    this.calculateCanvasDimensions();

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private raycaster: THREE.Raycaster;

  private pivot = new THREE.Object3D();
  private yaw = new THREE.Object3D();
  private pitch = new THREE.Object3D();

  private knownActors: Map<Renderable, Actor> = new Map();

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
    this.uiCanvas = new OffscreenCanvas(
      this.canvasDimensions.width,
      this.canvasDimensions.height
    );
    this.uiCanvasContext = this.uiCanvas.getContext("2d");

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
    plane.userData.clickable = true;
    this.scene.add(plane);

    this.scene.add(this.selectedTileMesh);
  }

  private updateCanvasSize() {
    // update canvas if necessary
    const newDimensions = this.calculateCanvasDimensions();
    if (
      newDimensions.width !== this.canvasDimensions.width ||
      newDimensions.height !== this.canvasDimensions.height
    ) {
      this.canvas.width = newDimensions.width;
      this.canvas.height = newDimensions.height;
      this.uiCanvas.width = newDimensions.width;
      this.uiCanvas.height = newDimensions.height;
      this.camera.aspect = newDimensions.width / newDimensions.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(newDimensions.width, newDimensions.height, false);
      this.canvasDimensions = newDimensions;
    }
  }

  draw(world: World, region: Region) {
    this.updateCanvasSize();
    this.draw3dScene(world, region);
    this.draw2dScene(world, region);

    return {
      canvas: this.canvas,
      uiCanvas: this.uiCanvas,
      flip: false,
      offsetX: 0,
      offsetY: 0,
    };
  }

  draw3dScene(world: World, region: Region) {
    // create actors
    region.entities.forEach((entity: Entity) => {
      let actor = this.knownActors.get(entity);
      if (!actor) {
        // this is not performant
        actor = new Actor(entity, () => entity.dying === 0);
        this.knownActors.set(entity, actor);
      }
    });

    region.players.forEach((player: Player) => {
      let actor = this.knownActors.get(player);
      if (!actor) {
        actor = new Actor(player, () => player.dying === 0);
        this.knownActors.set(player, actor);
      }
      // Update the camera position relative to the player's mesh
      const v = actor.getModel().getWorldPosition();
      this.pivot.position.lerp(v, 0.1);
    });

    region.mobs.concat(region.newMobs).forEach((mob: Mob) => {
      let actor = this.knownActors.get(mob);
      if (!actor) {
        actor = new Actor(mob, () => mob.dying === 0);
        this.knownActors.set(mob, actor);
      }
    });

    // remove actors
    this.knownActors.forEach((actor, entity) => {
      if (actor.shouldRemove()) {
        actor.destroy(this.scene);
        this.knownActors.delete(entity);
      } else {
        actor.draw(this.scene, world.tickPercent);
      }
    });

    // highlight selected tile
    if (this.selectedTile) {
      this.selectedTileMesh.position.x = this.selectedTile.x;
      this.selectedTileMesh.position.y = -0.4;
      this.selectedTileMesh.position.z = this.selectedTile.y;
    }
  }

  draw2dScene(world: World, region: Region) {
    // draw UI elements into a separate canvas that gets drawn over the 3d canvas
    this.uiCanvasContext.clearRect(
      0,
      0,
      this.uiCanvas.width,
      this.uiCanvas.height
    );

    const get2dOffset = (r: Renderable) => {
      const perceivedLocation = r.getPerceivedLocation(world.tickPercent);
      const { x, y } = this.projectToScreen(
        new THREE.Vector3(
          perceivedLocation.x + r.size / 2,
          r.height,
          perceivedLocation.y - r.size / 2
        )
      );
      return { x, y };
    };

    const renderables: Renderable[] = ([...region.players] as Renderable[])
      .concat(region.entities)
      .concat(region.mobs);

    renderables.forEach((r) => {
      r.drawUILayer(
        world.tickPercent,
        get2dOffset(r),
        this.uiCanvasContext,
        SPRITE_SCALE
      );
    });
  }

  // return canvas coordinates from world coordinates
  projectToScreen(vector: THREE.Vector3) {
    const newVector = vector.clone();
    newVector.project(this.camera);
    // i can't tell you why this shouldn't be the canvas width/height but this works...
    const { width, height } = this.canvasDimensions;
    return {
      x: Math.round((newVector.x + 1) * (width / 2)),
      y: Math.round((-newVector.y + 1) * (height / 2)),
    };
  }

  // return intersection with world object or world coordinates from canvas coordinates
  translateClick(offsetX, offsetY, world, viewport) {
    // i can't tell you why this shouldn't be the canvas width/height but this works...
    const { width, height } = this.canvasDimensions;
    const rayX = (offsetX / width) * 2 - 1;
    const rayY = -(offsetY / height) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(rayX, rayY), this.camera);
    const intersections = this.raycaster
      .intersectObjects(
        this.scene.children.filter((c) => c.userData.clickable === true)
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

    if (mobs.length > 0) {
      return {
        type: "entities" as const,
        mobs: _.uniq(mobs),
        players: [],
        groundItems: [],
      };
    }
    return {
      type: "coordinate" as const,
      location: {
        x: this.selectedTile.x,
        y: this.selectedTile.y + 1,
      },
    };
  }
}
