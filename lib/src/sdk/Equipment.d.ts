import { Item } from "./Item";
import { UnitBonuses, UnitEquipment } from "./Unit";
import { SetEffect } from "./SetEffect";
import { Player } from "./Player";
export declare enum EquipmentTypes {
    HELMET = "helmet",
    CHEST = "chest",
    LEGS = "legs",
    FEET = "feet",
    GLOVES = "gloves",
    WEAPON = "weapon",
    OFFHAND = "offhand",
    AMMO = "ammo",
    BACK = "back",
    NECK = "neck",
    RING = "ring"
}
export declare const EQUIPMENT_TYPE_TO_SLOT: {
    [equipmentType in EquipmentTypes]: keyof UnitEquipment;
};
export declare class Equipment extends Item {
    bonuses: UnitBonuses;
    constructor();
    get hasInventoryLeftClick(): boolean;
    inventoryLeftClick(player: Player): void;
    get equipmentSetEffect(): typeof SetEffect;
    setStats(): void;
    currentEquipment(player: Player): Equipment;
    assignToPlayer(player: Player): void;
    unassignToPlayer(player: Player): void;
    unequip(player: Player): void;
    get type(): EquipmentTypes;
    updateBonuses(gear: Item[]): void;
    /**
     * name of the model to render for this item
     */
    get model(): string | null;
    /**
     * index of animation to use for attacks if possible
     */
    get attackAnimationId(): number | null;
}
