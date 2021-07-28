
import { Equipment, EquipmentTypes } from './Equipment';

export class Helmet extends Equipment {
  
  get type(): EquipmentTypes {
    return EquipmentTypes.HELMET;
  }


}