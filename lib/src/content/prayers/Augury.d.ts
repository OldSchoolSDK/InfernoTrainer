import { BasePrayer, PrayerGroups } from "../../sdk/BasePrayer";
export declare class Augury extends BasePrayer {
    get name(): string;
    get groups(): PrayerGroups[];
    levelRequirement(): number;
    isOverhead(): boolean;
    feature(): string;
    drainRate(): number;
    playOnSound(): void;
    playOffSound(): void;
}
