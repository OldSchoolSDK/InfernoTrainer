import { Item } from "./Item";
import { UnitBonuses } from "./Unit";

export enum EquipmentTypes {
  HELMET ='helmet',
  CHEST = 'chest',
  LEGS = 'legs',
  FEET = 'feet',
  GLOVES = 'gloves',
  WEAPON = 'weapon',
  OFFHAND = 'offhand',
  AMMO = 'ammo',
  BACK = 'back'
}


export class Equipment extends Item {
  bonuses: UnitBonuses;

  get type(): EquipmentTypes {
    throw new Error('equipment must have a type');
  }

}