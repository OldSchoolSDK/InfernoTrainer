import { BasePrayer, PrayerGroups } from "./BasePrayer";
import { Player } from "./Player";
export declare class PrayerController {
    drainCounter: number;
    player: Player;
    constructor(player: Player);
    tick(player: Player): void;
    drainRate(): number;
    findPrayerByName(name: string): BasePrayer;
    isPrayerActiveByName(name: string): BasePrayer;
    activePrayers(): BasePrayer[];
    matchFeature(feature: string): BasePrayer;
    matchGroup(group: PrayerGroups): BasePrayer;
    overhead(): BasePrayer;
    prayers: BasePrayer[];
}
