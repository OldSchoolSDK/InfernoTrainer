import { UnitStats } from "./Unit";
export declare function SerializePlayerStats(stats: PlayerStats): string;
export declare function DeserializePlayerStats(serializedStats: string): PlayerStats;
export interface PlayerStats extends UnitStats {
    agility: number;
    run: number;
    specialAttack: number;
}
