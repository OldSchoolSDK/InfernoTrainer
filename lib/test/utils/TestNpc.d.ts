import { Mob } from "../../src/sdk/Mob";
export declare class TestNpc extends Mob {
    constructor(region: any, location: any, options: any);
    setStats(): void;
    get bonuses(): {
        attack: {
            stab: number;
            slash: number;
            crush: number;
            magic: number;
            range: number;
        };
        defence: {
            stab: number;
            slash: number;
            crush: number;
            magic: number;
            range: number;
        };
        other: {
            meleeStrength: number;
            rangedStrength: number;
            magicDamage: number;
            prayer: number;
        };
    };
    get attackSpeed(): number;
    get attackRange(): number;
    get size(): number;
    attackStyleForNewAttack(): string;
    canMeleeIfClose(): "crush";
}
