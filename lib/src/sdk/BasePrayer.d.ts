import { Player } from "./Player";
export declare enum PrayerGroups {
    OVERHEADS = "overheads",
    DEFENCE = "defence",
    STRENGTH = "strength",
    ACCURACY = "accuracy",
    RANGE = "range",
    HEARTS = "hearts",
    PROTECTITEM = "protectitem",
    PRESERVE = "preserve"
}
export declare class BasePrayer {
    lastActivated: number;
    isActive: boolean;
    isLit: boolean;
    cachedImage: HTMLImageElement;
    constructor();
    levelRequirement(): number;
    tick(): void;
    drainRate(): number;
    feature(): string;
    get name(): string;
    get groups(): PrayerGroups[];
    activate(player: Player): void;
    toggle(player: Player): void;
    deactivate(): void;
    isOverhead(): boolean;
    overheadImageReference(): string;
    overheadImage(): HTMLImageElement;
    playOffSound(): void;
    playOnSound(): void;
}
