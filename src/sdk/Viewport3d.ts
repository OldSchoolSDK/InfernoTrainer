"use strict";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { CardinalDirection, Region } from "./Region";

import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

import { Chrome } from "./Chrome";
import { Settings } from "./Settings";
import { Player } from "./Player";
import { Mob } from "./Mob";
import { Entity } from "./Entity";
import { Renderable } from "./Renderable";
import { Location } from "./Location";
import { Actor } from "./rendering/Actor";
import _ from "lodash";
import { Unit } from "./Unit";
import { Projectile } from "./weapons/Projectile";
import { TileMarkerModel } from "./rendering/TileMarkerModel";

// how many pixels wide should 2d elements be scaled to
const SPRITE_SCALE = 32;

const MIN_PITCH = -1;
const MAX_PITCH = 0.1;

const FLOOR_Y_POS = -0.5;

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;
  private uiCanvas: OffscreenCanvas;
  private uiCanvasContext: OffscreenCanvasRenderingContext2D;

  private canvasDimensions: { width: number; height: number } = this.calculateCanvasDimensions();

  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private raycaster: THREE.Raycaster;

  private pivot = new THREE.Object3D();
  private yaw = new THREE.Object3D();
  private pitch = new THREE.Object3D();

  private yawDelta = 0;
  private pitchDelta = 0;

  private stats = new Stats();

  private knownActors: Map<Renderable, Actor> = new Map();

  private selectedTile: Location | null = null;
  private selectedTileMesh: THREE.LineSegments;

  private clock = new THREE.Clock();

  constructor(faceCameraSouth = true) {
    this.scene = new THREE.Scene();

    this.canvas = new OffscreenCanvas(this.canvasDimensions.width, this.canvasDimensions.height);
    this.uiCanvas = new OffscreenCanvas(this.canvasDimensions.width, this.canvasDimensions.height);
    this.uiCanvasContext = this.uiCanvas.getContext("2d");

    this.camera = new THREE.PerspectiveCamera(70, this.canvasDimensions.width / this.canvasDimensions.height, 0.1, 50);
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;
    this.raycaster.params.Line.threshold = 0.1;

    const worldCanvas = document.getElementById("world") as HTMLCanvasElement;
    this.initCameraEvents(worldCanvas);
    window.addEventListener("resize", () => this.updateCanvasSize());

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      logarithmicDepthBuffer: true,
      antialias: true,
      //precision: "lowp", // is this making everything purple on mobile?
    });

    // Set up camera positioning
    this.camera.position.set(0, 1, 0);
    this.pivot.position.set(0, 0, 0);
    // Face south
    if (faceCameraSouth) {
      this.yaw.rotation.y = Math.PI;
    }
    // Pitch down slightly
    this.pitch.rotation.x = -0.7;
    // Zoom out
    this.camera.position.z = 12;
    this.scene.add(this.pivot);
    this.pivot.add(this.yaw);
    this.yaw.add(this.pitch);
    this.pitch.add(this.camera);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#FFFFFF",
      linewidth: 2,
    });
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.selectedTileMesh = new THREE.LineSegments(geometry, lineMaterial);
    this.scene.add(this.selectedTileMesh);

    this.animate();
  }

  // implementation from https://codepen.io/seanwasere/pen/BaMBoPd
  onDocumentMouseMove(e: MouseEvent) {
    if ((e.buttons & 4) !== 4) return;
    this.yaw.rotation.y -= e.movementX * 0.002;
    const v = this.pitch.rotation.x - e.movementY * 0.002;
    if (v > MIN_PITCH && v < MAX_PITCH) {
      this.pitch.rotation.x = v;
    }
    return false;
  }

  onDocumentMouseWheel(e: WheelEvent) {
    const v = this.camera.position.z + e.deltaY * 0.005;
    if (v >= 2 && v <= 20) {
      this.camera.position.z = v;
    }
    e.preventDefault();
    return false;
  }

  onKeyDown(e: KeyboardEvent) {
    // values are desired change per second
    switch (e.key) {
      case "ArrowLeft":
        this.yawDelta = -2;
        break;
      case "ArrowRight":
        this.yawDelta = 2;
        break;
      case "ArrowUp":
        this.pitchDelta = -1;
        break;
      case "ArrowDown":
        this.pitchDelta = 1;
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight":
        this.yawDelta = 0;
        break;
      case "ArrowUp":
      case "ArrowDown":
        this.pitchDelta = 0;
        break;
    }
  }

  initCameraEvents(canvas) {
    canvas.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
    canvas.addEventListener("wheel", this.onDocumentMouseWheel.bind(this), false);
    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    window.addEventListener("keyup", this.onKeyUp.bind(this), false);
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

    this.stats.update();
  }

  async initialise(world: World, region: Region) {
    document.body.appendChild(this.stats.dom);

    /*const light = new THREE.PointLight(0xffffaa, 1200);
    light.position.set(region.width / 2, 30, region.height / 2);
    this.scene.add(light);*/
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
    hemiLight.position.set(0, 100, 0);
    this.scene.add(hemiLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const floorCanvas = new OffscreenCanvas(region.width * SPRITE_SCALE, region.height * SPRITE_SCALE);
    const floorContext = floorCanvas.getContext("2d");

    region.drawWorldBackground(floorContext, SPRITE_SCALE);

    const floorTexture = new THREE.Texture(floorCanvas);
    floorTexture.needsUpdate = true;

    const floorGeometry = new THREE.PlaneGeometry(region.width, region.height, 1, 1);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      transparent: true,
      color: 0xffffff,
      side: THREE.FrontSide,
    });
    floorGeometry.rotateX(-Math.PI / 2);
    floorGeometry.translate(region.width / 2, FLOOR_Y_POS, region.height / 2 - 1);
    const plane = new THREE.Mesh(floorGeometry, floorMaterial);
    plane.userData.clickable = true;
    // used for right-click walk here
    plane.userData.isFloor = true;
    plane.visible = Viewport.viewport.player.region.drawDefaultFloor();
    this.scene.add(plane);

    this.scene.add(this.selectedTileMesh);

    // preload by adding a bunch of models to the scene but out of sight
    await Viewport.viewport.player.region.preload();
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  private updateCanvasSize() {
    // update canvas if necessary
    const newDimensions = this.calculateCanvasDimensions();
    if (newDimensions.width !== this.canvasDimensions.width || newDimensions.height !== this.canvasDimensions.height) {
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

  updateCamera(delta: number) {
    this.yaw.rotation.y += this.yawDelta * delta;
    this.pitch.rotation.x = Math.max(Math.min(this.pitch.rotation.x + this.pitchDelta * delta, MAX_PITCH), MIN_PITCH);
  }

  draw3dScene(world: World, region: Region) {
    // create actors
    region.entities.forEach((entity: Entity) => {
      let actor = this.knownActors.get(entity);
      if (!actor) {
        actor = new Actor(entity);
        this.knownActors.set(entity, actor);
      }
    });

    const projectiles: Projectile[] = [];
    region.players.forEach((player: Player) => {
      let actor = this.knownActors.get(player);
      if (!actor) {
        actor = new Actor(player);
        this.knownActors.set(player, actor);
      }
      // Update the camera position relative to the player's mesh
      const v = new THREE.Vector3(0.5, 0, -0.5);
      v.add(actor.getModel().getWorldPosition());
      this.pivot.position.lerp(v, 0.1);
      // Add all projectiles to scene
      projectiles.push(...player.incomingProjectiles);
    });

    region.mobs.concat(region.newMobs).forEach((mob: Mob) => {
      let actor = this.knownActors.get(mob);
      if (!actor) {
        actor = new Actor(mob);
        this.knownActors.set(mob, actor);
      }
      // Add all projectiles to scene
      projectiles.push(...mob.incomingProjectiles);
    });

    projectiles.forEach((projectile) => {
      let actor = this.knownActors.get(projectile);
      if (!actor) {
        actor = new Actor(projectile);
        this.knownActors.set(projectile, actor);
      }
    });

    const delta = this.clock.getDelta();
    this.updateCamera(delta);

    this.knownActors.forEach((actor, entity) => {
      if (actor.shouldRemove()) {
        // remove destroyed actors
        actor.destroy(this.scene);
        this.knownActors.delete(entity);
      } else {
        actor.draw(this.scene, delta, world.tickPercent);
      }
    });

    // highlight selected tile
    if (this.selectedTile) {
      this.selectedTileMesh.position.x = this.selectedTile.x - 0.5;
      this.selectedTileMesh.position.y = -0.49;
      this.selectedTileMesh.position.z = this.selectedTile.y - 0.5;
    }
  }

  draw2dScene(world: World, region: Region) {
    // draw UI elements into a separate canvas that gets drawn over the 3d canvas
    this.uiCanvasContext.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
    const translator = (pos: Location, z = 0) => this.projectToScreen(new THREE.Vector3(pos.x, z, pos.y));

    const get2dOffset = (r: Renderable) => {
      const perceivedLocation = r.getPerceivedLocation(world.tickPercent);
      const { x, y } = translator(
        {
          x: perceivedLocation.x + r.size / 2,
          y: perceivedLocation.y - r.size / 2,
        },
        r.height,
      );
      return { x, y };
    };
    const units: Unit[] = [...region.players, ...region.mobs];

    const renderables: Renderable[] = (units as Renderable[]).concat(region.entities).concat(region.mobs);

    renderables.forEach((r) => {
      r.drawUILayer(world.tickPercent, get2dOffset(r), this.uiCanvasContext, SPRITE_SCALE, false);
    });
  }

  // return canvas coordinates from world coordinates
  projectToScreen(vector: THREE.Vector3) {
    const newVector = vector.clone();
    newVector.project(this.camera);
    const { width, height } = this.canvasDimensions;
    return {
      x: Math.round((newVector.x + 1) * (width / 2)),
      y: Math.round((-newVector.y + 1) * (height / 2)),
    };
  }

  // return intersection with world object or world coordinates from canvas coordinates
  translateClick(offsetX, offsetY, world, viewport) {
    const { width, height } = this.canvasDimensions;
    const rayX = (offsetX / width) * 2 - 1;
    const rayY = -(offsetY / height) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(rayX, rayY), this.camera);
    // check intersection of the ray and the flor plane
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), FLOOR_Y_POS);
    const floor = new THREE.Vector3(0, 0, 0);
    this.raycaster.ray.intersectPlane(floorPlane, floor);

    this.selectedTile = {
      x: Math.floor(floor.x) + 0.5,
      y: Math.floor(floor.z) + 1.5,
    };
    const intersections = this.raycaster.intersectObjects(
      this.scene.children.filter((c) => c.userData.clickable === true),
    );

    // check if there were any NPCs on the way.
    const mobs = intersections
      .filter((i) => i.object.userData.unit instanceof Mob)
      .map((i) => i.object.userData.unit as Mob);

    // Note: we currently only handle clicking on mobs
    if (mobs.length > 0) {
      return {
        type: "entities" as const,
        mobs: _.uniq(mobs),
        players: [],
        groundItems: [],
        location: {
          x: this.selectedTile.x,
          y: this.selectedTile.y,
        },
      };
    }
    return {
      type: "coordinate" as const,
      location: {
        x: this.selectedTile.x,
        y: this.selectedTile.y,
      },
    };
  }

  setMapRotation(direction: CardinalDirection) {
    if (direction === CardinalDirection.SOUTH) {
      this.yaw.rotation.y = Math.PI;
    } else if (direction === CardinalDirection.NORTH) {
      this.yaw.rotation.y = 0;
    }
  }

  getMapRotation(): number {
    return this.yaw.rotation.y;
  }
}
