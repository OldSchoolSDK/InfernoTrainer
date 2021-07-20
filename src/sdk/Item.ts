import { UnitBonuses } from "./Unit";

export class Item {
  inventorySprite: HTMLImageElement;
  inventoryImage: string;
  inventoryPosition: number;
  bonuses: UnitBonuses; //temp
  selected: boolean;
}