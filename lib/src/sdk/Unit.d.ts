import { LineOfSightMask } from "./LineOfSight";
import { BasePrayer } from "./BasePrayer";
import { Projectile } from "./weapons/Projectile";
import { XpDrop } from "./XpDrop";
import { Location } from "./Location";
import { Weapon } from "./gear/Weapon";
import { Offhand } from "./gear/Offhand";
import { Helmet } from "./gear/Helmet";
import { Necklace } from "./gear/Necklace";
import { Chest } from "./gear/Chest";
import { Legs } from "./gear/Legs";
import { Feet } from "./gear/Feet";
import { Gloves } from "./gear/Gloves";
import { Ring } from "./gear/Ring";
import { Cape } from "./gear/Cape";
import { Ammo } from "./gear/Ammo";
import { SetEffect } from "./SetEffect";
import { EntityName } from "./EntityName";
import { Item } from "./Item";
import { PrayerController } from "./PrayerController";
import { Region } from "./Region";
import { CollisionType } from "./Collision";
import { Renderable } from "./Renderable";
import { Sound } from "./utils/SoundCache";
import { TextSegment } from "./utils/Text";
export declare enum UnitTypes {
    MOB = 0,
    PLAYER = 1,
    ENTITY = 2
}
export declare class UnitEquipment {
    weapon?: Weapon;
    offhand?: Offhand;
    helmet?: Helmet;
    necklace?: Necklace;
    chest?: Chest;
    legs?: Legs;
    feet?: Feet;
    gloves?: Gloves;
    ring?: Ring;
    cape?: Cape;
    ammo?: Ammo;
}
export interface UnitOptions {
    aggro?: Unit;
    equipment?: UnitEquipment;
    spawnDelay?: number;
    cooldown?: number;
    inventory?: Item[];
}
export interface UnitStats {
    attack: number;
    strength: number;
    defence: number;
    range: number;
    magic: number;
    hitpoint: number;
    prayer?: number;
}
export interface UnitBonuses {
    attack: UnitStyleBonuses;
    defence: UnitStyleBonuses;
    other: UnitOtherBonuses;
    targetSpecific?: UnitTargetBonuses;
}
export interface UnitStyleBonuses {
    stab: number;
    slash: number;
    crush: number;
    magic: number;
    range: number;
}
export interface UnitOtherBonuses {
    meleeStrength: number;
    rangedStrength: number;
    magicDamage: number;
    prayer: number;
    crystalAccuracy?: number;
    crystalDamage?: number;
}
export interface UnitTargetBonuses {
    undead: number;
    slayer: number;
}
export declare abstract class Unit extends Renderable {
    prayerController: PrayerController;
    lastOverhead?: BasePrayer;
    aggro?: Unit;
    perceivedLocation: Location;
    attackDelay: number;
    lastHitAgo: number;
    hasLOS: boolean;
    frozen: number;
    stunned: number;
    incomingProjectiles: Projectile[];
    healHitsplatImage: HTMLImageElement;
    missedHitsplatImage: HTMLImageElement;
    damageHitsplatImage: HTMLImageElement;
    unitImage: HTMLImageElement;
    currentStats: UnitStats;
    stats: UnitStats;
    equipment: UnitEquipment;
    setEffects: (typeof SetEffect)[];
    autoRetaliate: boolean;
    age: number;
    lastRotation: number;
    hasDiedAndAwaitingRemoval: boolean;
    nulledTicks: number;
    overheadText: string | null;
    overheadTextTimer: number;
    get deathAnimationLength(): number;
    get completeSetEffects(): SetEffect[];
    get type(): UnitTypes;
    get isPlayer(): boolean;
    get xpBonusMultiplier(): number;
    mobName(): EntityName;
    get isNulled(): boolean;
    get combatLevel(): number;
    combatLevelColor(against: Unit): string;
    constructor(region: Region, location: Location, options?: UnitOptions);
    contextActions(region: Region, x: number, y: number): any[];
    setAggro(mob: Unit): void;
    grantXp(xpDrop: XpDrop): void;
    setStats(): void;
    movementStep(): void;
    attackStep(): void;
    didAttack(): void;
    playAttackAnimation(): void;
    getPerceivedLocation(tickPercent: number): {
        x: number;
        y: number;
        z: number;
    };
    getPerceivedRotation(tickPercent: any): number;
    addedToWorld(): void;
    getTrueLocation(): Location;
    removedFromWorld(): void;
    static mergeEquipmentBonuses(firstBonuses: UnitBonuses, secondBonuses: UnitBonuses): UnitBonuses;
    static emptyBonuses(): UnitBonuses;
    get bonuses(): UnitBonuses;
    get attackSpeed(): number;
    get flinchDelay(): number;
    get attackRange(): number;
    get maxHit(): number;
    get image(): string;
    get isAnimated(): boolean;
    canMove(): boolean;
    canAttack(): boolean;
    freeze(ticks: number): void;
    isFrozen(): boolean;
    isStunned(): boolean;
    region: Region;
    location: Location;
    dying: number;
    _serialNumber: string;
    get serialNumber(): string;
    get size(): number;
    isDying(): boolean;
    get collisionType(): CollisionType;
    get lineOfSight(): LineOfSightMask;
    isOnTile(x: number, y: number): boolean;
    getClosestTileTo(x: number, y: number): [number, number];
    get rangeAttackAnimation(): any;
    /** Sounds **/
    hitSound(damaged: boolean): Sound | null;
    get color(): string;
    get healthScale(): number;
    shouldDestroy(): boolean;
    shouldShowAttackAnimation(): boolean;
    setHasLOS(): void;
    isWithinMeleeRange(): boolean;
    addProjectile(projectile: Projectile): void;
    setLocation(location: Location): void;
    attackAnimation(tickPercent: number, context: OffscreenCanvasRenderingContext2D): void;
    cancelDeath(): void;
    dead(): void;
    detectDeath(): void;
    processIncomingAttacks(): void;
    shouldChangeAggro(projectile: Projectile): boolean;
    postAttacksEvent(): void;
    damageTaken(): void;
    setOverheadText(text: string): void;
    drawOverheadText(context: OffscreenCanvasRenderingContext2D, scale: number, alignCenter?: boolean, prefix?: string): void;
    drawText(context: OffscreenCanvasRenderingContext2D, textParts: TextSegment[], scale: number, alignCenter?: boolean, prefix?: string): void;
    draw(tickPercent: any, context: any, offset: any, scale: any, drawUnderTile: any): void;
    drawHitsplat(projectile: Projectile): boolean;
    drawHPBar(context: OffscreenCanvasRenderingContext2D, scale: number): void;
    drawHitsplats(context: OffscreenCanvasRenderingContext2D, scale: number, above: boolean): void;
    drawOverheadPrayers(context: OffscreenCanvasRenderingContext2D, scale: number): void;
    get idlePoseId(): number;
    get walkingPoseId(): number | null;
    get animationIndex(): number;
    get attackAnimationId(): number | null;
    get canBlendAttackAnimation(): boolean;
    get deathAnimationId(): number | null;
}
