import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";
export declare enum AmmoType {
    BLESSING = 0,
    AMMO = 1
}
export declare class Ammo extends Equipment {
    get type(): EquipmentTypes;
    ammoType(): AmmoType;
    assignToPlayer(player: Player): void;
    unassignToPlayer(player: Player): void;
    currentEquipment(player: Player): Equipment;
}
