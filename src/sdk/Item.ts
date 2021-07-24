import { UnitBonuses } from "./Unit";

export class Item {
  inventorySprite: HTMLImageElement;
  inventoryPosition: number;
  bonuses: UnitBonuses; //temp
  selected: boolean;

  get inventoryImage (): string {
    return ''
  }
}