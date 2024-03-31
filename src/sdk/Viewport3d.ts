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
}

export class Viewport3d implements ViewportDelegate {
  private canvas: OffscreenCanvas;

  private canvasDimensions: { width: number; height: number } =
    this.calculateCanvasDimensions();

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private raycaster: THREE.Raycaster;

  private controls: OrbitControls;

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
    this.camera.position.set(20, 30, 20);
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;

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
      .map((i) => {
        console.log(i);
        return i;
      })
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
      x: intersection.point.x,
      y: intersection.point.z,
    };
    return {
      x: intersection.point.x * Settings.tileSize,
      y: intersection.point.z * Settings.tileSize,
    };
  }
}
