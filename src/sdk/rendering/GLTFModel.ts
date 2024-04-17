import * as THREE from "three";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";

import { Model } from "./Model";
import { Renderable, RenderableListener } from "../Renderable";
import { Location } from "../Location";
import { Viewport } from "../Viewport";
import { Viewport3d } from "../Viewport3d";
import { drawLineNormally, drawLineOnTop } from "./RenderUtils";

const OUTLINE_NORMAL = 0xffffff;
const OUTLINE_SELECTED = 0xff0000;

// global loader across models
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

/**
 * Render the model using one or more GLTF models. If there are multiple models, they are drawn superimposed on the same spot and are expected
 * to have the same animation set.
 */
export class GLTFModel implements Model, RenderableListener {
  static forRenderable(
    r: Renderable,
    model: string,
    scale: number,
    verticalOffset = -0.49,
    originOffset: Location = { x: 0, y: 0 },
  ) {
    return new GLTFModel(r, [model], scale, verticalOffset, originOffset);
  }

  static forRenderableMulti(
    r: Renderable,
    models: string[],
    scale: number,
    verticalOffset = -0.49,
    originOffset: Location = { x: 0, y: 0 },
  ) {
    return new GLTFModel(r, models, scale, verticalOffset, originOffset);
  }

  private outline: THREE.LineSegments;
  private outlineMaterial: THREE.LineBasicMaterial;

  private hullGeometry: THREE.CylinderGeometry;
  private clickHull: THREE.Mesh;

  // parent object for all models loaded into this
  private loadedModel: THREE.Object3D | null = null;
  private hasInitialisedModel = false;
  private modelCache: { [name: string]: GLTF } = {};
  private mixers: THREE.AnimationMixer[] = [];

  private lastPoseId = -1;
  private playingAnimationId = -1;
  private playingAnimationCanBlend = false;
  // first index is the model ID, second index is the animation ID.
  private animations: THREE.AnimationAction[][] = [];

  constructor(
    private renderable: Renderable,
    private models: string[],
    private scale: number,
    private verticalOffset,
    private originOffset,
  ) {
    const { size } = renderable;

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
    this.outline.visible = renderable.drawOutline;

    const hullMaterial = new THREE.MeshBasicMaterial({ color: 0x00000000 });
    hullMaterial.transparent = true;
    // size of hull get set once the model loads
    this.hullGeometry = new THREE.CylinderGeometry(1, 1, 1, 6);
    this.clickHull = new THREE.Mesh(this.hullGeometry, hullMaterial);
    this.clickHull.userData.clickable = renderable.selectable;
    this.clickHull.userData.unit = renderable;
    this.clickHull.visible = false;
  }

  animationChanged(id, blend) {
    this.startPlayingAnimation(id, blend);
  }

  modelChanged() {
    if (!this.loadedModel) {
      return;
    }
    // TODO: what if get3dModel() now returns something other than GLTFModel? Bad times...
    const newModels = (this.renderable.get3dModel() as GLTFModel).models;
    const toRemove = this.models.filter((model) => !newModels.includes(model));
    const toAdd = newModels.filter((model) => !this.models.includes(model));
    toRemove.forEach((name) => this.loadedModel.remove(this.loadedModel.getObjectByName(name)));
    this.models = newModels;
    toAdd.forEach((name) => this.loadAndAddSingleModel(this.loadedModel, name));
  }

  stopCurrentAnimation() {
    // needed otherwise the animations bleed into each other
    this.mixers.forEach((mixer) => mixer.stopAllAction());
  }

  /**
   * 
   * @param id id (in the animation file) to play
   * @param blend blend the new animation with the pose animation
   */
  startPlayingAnimation(id: number, blend = false) {
    if (!blend) {
      this.stopCurrentAnimation();
      this.animations.forEach((animationsForModel) => {
        animationsForModel.forEach((animation) => animation.setEffectiveWeight(1.0));
      });
    } else {
      this.animations.forEach((animationsForModel) => {
        animationsForModel.forEach((animation) => animation.setEffectiveWeight(0.5));
      });
    }
    this.playingAnimationId = id;
    this.playingAnimationCanBlend = blend;
    this.animations.forEach((animationsForModel) => {
      // play the animation for each part of the body
      const newAnimation = animationsForModel[id];
      newAnimation.setEffectiveWeight(blend ? 1 : 1.0);
      newAnimation.stop().setLoop(THREE.LoopOnce, 1).play();
    });
    // reset the timer of the mixers because it seems to bug out and show the first frame sometimes
    // suspect that it has to do with the mixer time exceeding the length of the animation?
    this.mixers.forEach((mixerForModel) => mixerForModel.setTime(0));
  }

  onAnimationFinished(action?: THREE.AnimationAction) {
    this.stopCurrentAnimation();
    const nextAnimIndex = this.renderable.animationIndex;

    this.animations.forEach((animationsForModel, i) => {
      const newAnimation = animationsForModel[nextAnimIndex];
      if (this.playingAnimationCanBlend) {
        newAnimation.setEffectiveWeight(1.0);
      }
      // play the fallback/pose animation
      newAnimation.stop().setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY).play();
    });
    this.playingAnimationId = -1;
    this.playingAnimationCanBlend = false;
  }

  onPoseChanged(newPoseId) {
    console.log('pose changed', newPoseId)
    this.animations.forEach((animationsForModel, i) => {
      const lastAnimation = animationsForModel[this.lastPoseId];
      lastAnimation.stop();
      if (this.playingAnimationId >= 0 && !this.playingAnimationCanBlend) {
        return;
      }
      const newAnimation = animationsForModel[newPoseId];
      // play the fallback/pose animation
      newAnimation.stop().setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY).play();
    });
  }

  loadAndAddSingleModel(target, model) {
    if (this.modelCache[model]) {
      target.add(this.modelCache[model].scene);
      return;
    }
    loader.load(model, (gltf: GLTF) => {
      this.modelCache[model] = gltf;
      const scale = this.scale;
      gltf.scene.name = model;
      // make adjustments
      gltf.scene.scale.set(scale, scale, scale);
      target.add(gltf.scene);
      // load and start animating
      if (gltf.animations.length === 0) {
        return;
      }
      const size = new THREE.Vector3();
      new THREE.Box3().setFromObject(gltf.scene).getSize(size);
      const clickboxHeight = Math.max(this.renderable.size, 0.4 * size.y);
      this.hullGeometry.scale(0.4 * this.renderable.size, clickboxHeight, 0.4 * this.renderable.size);
      this.hullGeometry.translate(0, clickboxHeight / 2 - 0.49, 0);
      const mixer = new THREE.AnimationMixer(gltf.scene);
      this.mixers.push(mixer);
      this.animations.push(
        gltf.animations.map((animation) => {
          const action = mixer.clipAction(animation);
          action.clampWhenFinished = true;
          action.zeroSlopeAtEnd = false;
          action.zeroSlopeAtStart = false;
          return action;
        }),
      );
      this.onAnimationFinished();
      // add listener to first mixer only
      if (this.mixers.length === 1) {
        mixer.addEventListener("finished", (e) => {
          this.onAnimationFinished(e.action);
        });
      }
    });
  }

  initialiseWholeModel() {
    const preparingMesh = new THREE.Object3D();
    this.models.forEach((model) => this.loadAndAddSingleModel(preparingMesh, model));
    this.loadedModel = preparingMesh;
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location, rotation: number) {
    if (!this.hasInitialisedModel) {
      this.initialiseWholeModel();
      this.hasInitialisedModel = true;
    }
    if (this.loadedModel && this.loadedModel.parent !== scene) {
      scene.add(this.loadedModel);
      this.renderable.setAnimationListener(this);
    }
    if (this.outline.parent !== scene) {
      scene.add(this.outline);
      scene.add(this.clickHull);
    }

    this.outlineMaterial.color.setHex(this.renderable.selected ? OUTLINE_SELECTED : OUTLINE_NORMAL);
    if (this.renderable.selected) {
      drawLineOnTop(this.outline);
    } else {
      drawLineNormally(this.outline);
    }
    if (this.renderable.animationIndex !== this.lastPoseId) {
      // start a new pose if the pose index changes and we're not currently playing an animation
      this.onPoseChanged(this.renderable.animationIndex);
      this.lastPoseId = this.renderable.animationIndex;
    }

    const { x, y } = location;
    this.outline.position.x = x;
    this.outline.position.y = -0.49;
    this.outline.position.z = y;
    this.clickHull.position.x = x + this.renderable.size / 2;
    this.clickHull.position.z = y - this.renderable.size / 2;

    if (this.loadedModel) {
      this.mixers.forEach((mixer) => mixer.update(clockDelta));

      const { size } = this.renderable;
      const adjustedRotation = rotation + Math.PI / 2;
      this.loadedModel.position.x = x + size / 2 + this.originOffset.x;
      this.loadedModel.position.y = this.verticalOffset;
      this.loadedModel.position.z = y - size / 2 + this.originOffset.y;
      this.loadedModel.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), adjustedRotation);
    }
  }

  destroy(scene: THREE.Scene) {
    if (this.loadedModel && this.loadedModel.parent === scene) {
      scene.remove(this.loadedModel);
      this.renderable.clearAnimationListener();
    }
    if (this.outline.parent === scene) {
      scene.remove(this.outline);
      scene.remove(this.clickHull);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.outline.getWorldPosition(new THREE.Vector3());
  }

  private static until(condition: () => boolean) {
    const poll = (res) => {
      if (condition()) {
        res();
      } else {
        setTimeout(() => poll(res), 50);
      }
    };
    return new Promise(poll);
  }

  async preload() {
    await Promise.all(this.models.map((model) => GLTFModel.preload(model)));
    return;
  }

  static async preload(model: string) {
    const gltf = await loader.loadAsync(model);
    const scene = (Viewport.viewport.getDelegate() as Viewport3d).scene;
    const camera = new THREE.PerspectiveCamera();
    gltf.scene.scale.set(0.01, 0.01, 0.01);
    gltf.scene.position.set(20, 0, 20);

    scene.add(gltf.scene);
    camera.position.set(10, 10, 10);
    camera.lookAt(gltf.scene.position);

    const renderer = new THREE.WebGLRenderer({
      canvas: new OffscreenCanvas(1, 1),
    });
    renderer.setSize(1, 1, false);
    let didRender = false;
    requestAnimationFrame(() => {
      renderer.render(scene, camera);
      didRender = true;
    });
    await GLTFModel.until(() => didRender);
    scene.remove(gltf.scene);
    renderer.dispose();
    renderer.forceContextLoss();
    return;
  }
}
