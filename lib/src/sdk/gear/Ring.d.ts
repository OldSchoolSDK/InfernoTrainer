import { Equipment, EquipmentTypes } from "../Equipment";
import { Player } from "../Player";
export declare class Ring extends Equipment {
    get type(): EquipmentTypes;
    assignToPlayer(player: Player): void;
    unassignToPlayer(player: Player): void;
    currentEquipment(player: Player): Equipment;
}
