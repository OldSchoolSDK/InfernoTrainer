import { Weapon } from "./gear/Weapon";
export declare enum AttackStyleTypes {
    CROSSBOW = "CROSSBOW",
    BOW = "BOW",
    CHINCHOMPA = "CHINCOMPA",
    GUN = "GUN",
    THROWN = "THROWN",
    BLADEDSTAFF = "BLADEDSTAFF",
    POWEREDSTAFF = "POWEREDSTAFF",
    STAFF = "STAFF",
    SALAMANDER = "SALAMANDER",
    TWOHANDSWORD = "TWOHANDSWORD",
    AXE = "AXE",
    BANNER = "BANNER",
    BLUNT = "BLUNT",
    BLUDGEON = "BLUDGEON",
    BULWARK = "BULWARK",
    CLAW = "CLAW",
    PICKAXE = "PICKAXE",
    POLEARM = "POLEARM",
    POLESTAFF = "POLESTAFF",
    SCYTHE = "SCYTHE",
    SLASHSWORD = "SLASHSWORD",
    SPEAR = "SPEAR",
    SPIKEDWEAPON = "SPIKEDWEAPON",
    STABSWORD = "STABSWORD",
    UNARMED = "UNARMED",
    WHIP = "WHIP"
}
export declare enum AttackStyle {
    ACCURATE = "ACCURATE",
    RAPID = "RAPID",
    LONGRANGE = "LONGRANGE",
    REAP = "REAP",
    AGGRESSIVECRUSH = "AGGRESSIVE (CRUSH)",
    AGGRESSIVESLASH = "AGGRESSIVE (SLASH)",
    STAB = "STAB",
    DEFENSIVE = "DEFENSIVE",
    CONTROLLED = "CONTROLLED",
    AUTOCAST = "AUTOCAST",
    SHORT_FUSE = "SHORT_FUSE",
    MEDIUM_FUSE = "MEDIUM_FUSE",
    LONG_FUSE = "LONG_FUSE"
}
interface AttackStyleStorage {
    [key: string]: AttackStyle;
}
interface AttackStyleImageMap {
    [type: string]: IAttackStyleImageMap;
}
interface IAttackStyleImageMap {
    [style: string]: HTMLImageElement;
}
export declare class AttackStylesController {
    static attackStyleImageMap: AttackStyleImageMap;
    static attackStyleXpType: Record<AttackStyle, {
        skill: string;
        multiplier: number;
    }[]>;
    static attackStyleStrengthBonus: {
        [style in AttackStyle]?: number;
    };
    static controller: AttackStylesController;
    stylesMap: AttackStyleStorage;
    getAttackStyleForType(type: AttackStyleTypes, weapon: Weapon): AttackStyle;
    setWeaponAttackStyle(weapon: Weapon, newStyle: AttackStyle): void;
    getWeaponAttackStyle(weapon: Weapon): AttackStyle;
    getWeaponXpDrops(style: AttackStyle, damage: number, npcMultiplier: number): {
        xp: number;
        skill: string;
    }[];
    getWeaponStrengthBonus(style: AttackStyle): number;
}
export {};
