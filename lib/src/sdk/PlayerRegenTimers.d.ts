import { Player } from "./Player";
export declare class PlayerRegenTimer {
    player: Player;
    spec: number;
    hitpoint: number;
    constructor(player: Player);
    specUsed(): void;
    regen(): void;
    specRegen(): void;
    hitpointRegen(): void;
}
