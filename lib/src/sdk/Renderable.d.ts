import { Location, Location3 } from "./Location";
import { Model } from "./rendering/Model";
export interface RenderableListener {
    animationChanged(id: number, blend: boolean): Promise<void>;
    modelChanged(): any;
}
export declare abstract class Renderable {
    private _selected;
    private cachedModel;
    private animationChangeListener;
    private queuedAnimationId;
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
    getPerceivedPitch(tickPercent: number): number;
    /**
     * allow offsetting the components of a multi-model renderable
     */
    getPerceivedOffsets(tickPercent: number): Location3[];
    abstract get size(): number;
    get drawOutline(): boolean;
    get drawTrueTile(): boolean;
    get height(): number;
    get clickboxHeight(): number | null;
    get clickboxRadius(): number | null;
    abstract get color(): string;
    get colorHex(): number;
    get selectable(): boolean;
    visible(tickPercent: any): boolean;
    /**
     * Should remove from the scene
     */
    abstract shouldDestroy(): boolean;
    get selected(): boolean;
    set selected(selected: boolean);
    drawUILayer(tickPercent: number, screenPosition: Location, context: OffscreenCanvasRenderingContext2D, scale: number, hitsplatAbove?: boolean): void;
    draw(tickPercent: number, context: OffscreenCanvasRenderingContext2D, offset?: Location, scale?: number, drawUnderTile?: boolean): void;
    /**
     * Return a new model for this renderable in 3d mode. it will be associated with the Renderable and destroyed when the renderable is
     * destroyed.
     */
    protected create3dModel(): Model | null;
    get3dModel(): Model | null;
    /**
     * Return the index of the animation that should be playing at this moment.
     * Note: if the value changes, the new animation will start upon the next tick.
     */
    abstract get animationIndex(): any;
    playAnimation(index: number, blend?: boolean): Promise<void>;
    setAnimationListener(listener: RenderableListener): void;
    clearAnimationListener(): void;
    invalidateModel(): void;
    preload(): Promise<void>;
}
