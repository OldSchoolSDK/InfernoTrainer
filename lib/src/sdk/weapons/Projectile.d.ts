import { Location, Location3 } from "../Location";
import { Unit } from "../Unit";
import { Weapon } from "../gear/Weapon";
import { Sound } from "../utils/SoundCache";
import { Renderable } from "../Renderable";
import { BasicModel } from "../rendering/BasicModel";
import { GLTFModel } from "../rendering/GLTFModel";
export interface ProjectileMotionInterpolator {
    interpolate(from: Location3, to: Location3, percent: number): Location3;
    interpolatePitch(from: Location3, to: Location3, percent: number): number;
}
export interface MultiModelProjectileOffsetInterpolator {
    interpolateOffsets(from: Location3, to: Location3, percent: number): Location3[];
}
export interface ProjectileOptions {
    forceSWTile?: boolean;
    hidden?: boolean;
    checkPrayerAtHit?: boolean;
    setDelay?: number;
    reduceDelay?: number;
    cancelOnDeath?: boolean;
    color?: string;
    size?: number;
    motionInterpolator?: ProjectileMotionInterpolator;
    visualDelayTicks?: number;
    visualHitEarlyTicks?: number;
    sound?: Sound;
    projectileSound?: Sound;
    hitSound?: Sound;
    model?: string;
    modelScale?: number;
    models?: string[];
    offsetsInterpolator?: MultiModelProjectileOffsetInterpolator;
    verticalOffset?: number;
}
export declare class Projectile extends Renderable {
    private weapon;
    damage: number;
    from: Unit;
    to: Unit | Location3;
    distance: number;
    options: ProjectileOptions;
    remainingDelay: number;
    totalDelay: number;
    age: number;
    startLocation: Location;
    currentLocation: Location;
    currentHeight: number;
    attackStyle: string;
    offsetX: number;
    offsetY: number;
    image: HTMLImageElement;
    interpolator: ProjectileMotionInterpolator;
    _color: string;
    _size: number;
    constructor(weapon: Weapon | null, damage: number, from: Unit, to: Unit | Location3, attackStyle: string, options?: ProjectileOptions);
    private isMeleeStyle;
    private getColor;
    getTargetDestination(tickPercent: any): Location3;
    getPerceivedRotation(tickPercent: any): number;
    getPerceivedPitch(tickPercent: number): number;
    private getPercent;
    checkSound(sound: Sound, delay: number): void;
    onTick(): void;
    beforeHit(): void;
    shouldDestroy(): boolean;
    visible(tickPercent: any): boolean;
    getPerceivedLocation(tickPercent: number): Location3;
    getPerceivedOffsets(tickPercent: number): Location3[];
    getTrueLocation(): Location3;
    get size(): number;
    get color(): string;
    get drawOutline(): boolean;
    protected create3dModel(): GLTFModel | BasicModel;
    get animationIndex(): number;
}
export declare class LinearProjectileMotionInterpolator implements ProjectileMotionInterpolator {
    interpolate(from: Location3, to: Location3, percent: number): {
        x: number;
        y: number;
        z: number;
    };
    interpolatePitch(from: Location3, to: Location3, percent: number): number;
}
export declare class ArcProjectileMotionInterpolator implements ProjectileMotionInterpolator {
    private height;
    constructor(height: number);
    interpolate(from: Location3, to: Location3, percent: number): {
        x: number;
        y: number;
        z: number;
    };
    interpolatePitch(from: Location3, to: Location3, percent: number): number;
}
export declare class FollowTargetInterpolator implements ProjectileMotionInterpolator {
    interpolate(from: Location3, to: Location3, percent: number): {
        x: number;
        y: number;
        z: number;
    };
    interpolatePitch(from: Location3, to: Location3, percent: number): number;
}
