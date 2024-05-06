import { Ammo, AmmoType } from "../../sdk/gear/Ammo";
export declare class HolyBlessing extends Ammo {
    inventorySprite: HTMLImageElement;
    get inventoryImage(): string;
    get weight(): number;
    ammoType(): AmmoType;
    constructor();
}
