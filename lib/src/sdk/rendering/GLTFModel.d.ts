import * as THREE from "three";
import { Model } from "./Model";
import { Renderable, RenderableListener } from "../Renderable";
import { Location, Location3 } from "../Location";
/**
 * Render the model using one or more GLTF models. If there are multiple models, they are drawn superimposed on the same spot and are expected
 * to have the same animation set.
 */
export declare class GLTFModel implements Model, RenderableListener {
    private renderable;
    private models;
    private scale;
    private verticalOffset;
    private originOffset;
    static forRenderable(r: Renderable, model: string, scale: number, verticalOffset?: number, originOffset?: Location): GLTFModel;
    static forRenderableMulti(r: Renderable, models: string[], scale: number, verticalOffset?: number, originOffset?: Location): GLTFModel;
    private outline;
    private outlineMaterial;
    private trueTile;
    private hullGeometry;
    private clickHull;
    private loadedModel;
    private hasInitialisedModel;
    private mixers;
    private lastPoseId;
    private playingAnimationId;
    private playingAnimationCanBlend;
    private playingAnimationPromiseResolve;
    private animations;
    private modelOrder;
    constructor(renderable: Renderable, models: string[], scale: number, verticalOffset: any, originOffset: any);
    animationChanged(id: any, blend: any): Promise<void>;
    modelChanged(): void;
    stopCurrentAnimation(): void;
    /**
     *
     * @param id id (in the animation file) to play
     * @param blend blend the new animation with the pose animation
     */
    startPlayingAnimation(id: number, blend?: boolean): Promise<void>;
    onAnimationFinished(action?: THREE.AnimationAction): void;
    onPoseChanged(newPoseId: any): void;
    loadAndAddSingleModel(target: any, model: any, index: any): void;
    initialiseWholeModel(): void;
    draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location3, rotation: number, pitch: number, visible: boolean, modelOffsets: Location3[]): void;
    destroy(scene: THREE.Scene): void;
    getWorldPosition(): THREE.Vector3;
    private static until;
    preload(): Promise<void>;
    static preload(model: string): Promise<void>;
}
