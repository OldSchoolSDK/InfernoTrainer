import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
export declare class ProtectMage extends BasePrayer {
    get name(): string;
    get groups(): PrayerGroups[];
    levelRequirement(): number;
    drainRate(): number;
    isOverhead(): boolean;
    overheadImageReference(): string;
    feature(): string;
    playOnSound(): void;
    playOffSound(): void;
}
